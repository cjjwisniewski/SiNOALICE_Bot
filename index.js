/*
Name: Gretel Bot
Author: Cameron Wisniewski
Date: 9/25/20
Version: 1.0
Comment: Simple Discord bot intended for use in my SiNOALICE Discord guild chat. 
Link: discordjs.guide
*/

//Initial declarations
const fs = require('fs');
const Discord = require('discord.js');
var cron = require('node-cron');
const config = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const fetch = require('node-fetch');
const querystring = require('querystring');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

//Load in command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Declare variables
const token = config.token
const prefix = config.prefix

//Print statement to verify startup
client.once('ready', () => {
	console.log("If I can be with Brother, that's all I need.");
	console.log(`Configured command prefix is: ${prefix}`)
});

//Load in environment variables
const GRETEL_BOT_TOKEN = process.env.GRETEL_BOT_TOKEN;

//__________CHAT FUNCTIONS__________
//Listen to incoming messages
client.on('message', async message => {
	//Misc chat functions to process before escaping noncommand text


	//Add reactions
	//Hansel/Brother react
	//Orb react for Cardboard_box server
	if(!(message.content.startsWith(prefix)) && !(message.author.bot) && (message.guild.id == config.serverid) && (message.content.toLowerCase().includes('orb'))) {
		message.react(config.orbemojiid);
	}
	//Remy react for Cardboard_box server
	if(!(message.content.startsWith(prefix)) && !(message.author.bot) && (message.guild.id == config.serverid) && (message.content.toLowerCase().includes('remy'))) {
		message.react(config.remyemojiid);
	}
	//Remy react for Cardboard_box server
	if(!(message.content.startsWith(prefix)) && !(message.author.bot) && (message.guild.id == config.serverid) && (message.content.toLowerCase().includes('lammy'))) {
		message.react(config.lammyemojiid);
	}
	
	/*
	Command handler code begins here!
	*/

	//Escape if the message didn't start with a prefix or was sent by a bot
	if(!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	//Break command away from command prefix and parse arguments
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	//Urbandictionary
	if(commandName === 'urban') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });
		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
	
		if (!list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}
	
		const [answer] = list;
	
		const embed = new Discord.MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` }
			)
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
	
		message.channel.send(embed);
	}

	//Private Chat Functions
	//Send
	if(commandName === 'send' && message.author.id === config.myuserid) {
		if (!args.length) {
			return message.channel.send('Please provide arguments for ChannelID and message content.')
		}
		
		const targetchannel = args[0]
		const messagecontent = args.slice(1).join(' ');

		const embed = new Discord.MessageEmbed()
			.setColor('#3CB371')
			.addFields(
				{ name: 'Gretel says...', value: messagecontent },
			)
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');

		client.channels.cache.get(targetchannel).send(embed);
		message.delete;
	}

	//Verify that command exists within command list
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) {
		return;
	}

	//Return error if channel only command is used in a PM
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	//Return error if there's a problem with command arguments
	if((command.args) && !(args.length)) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if(command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	//Cooldown code taken from discordjs.guide
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	//Execute command
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

//Scheduled Functions
client.on('ready',async() => {
	//Colosseum Timer
	cron.schedule('40 2 * * *', () => {
		const embed = new Discord.MessageEmbed()
			.setColor('#8B0000')
			.addFields(
				{ name: 'It\'s time for colosseum!', value: 'I wonder if these people will all fit into the oven... What do you think, @everyone?' },
			)
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
		
		client.channels.cache.get(config.colochannelid).send(embed);
	});
	
	//Conquest Timer 1
	cron.schedule('30 1,3,11,13,15,17,19,21,23 * * *', () => {
		const embed = new Discord.MessageEmbed()
			.setColor('#006400')
			.addFields(
				{ name: 'Conquest Notification', value: 'Don\'t worry Brother, I won\'t let that scary thing eat you!' },
			)
			//.setImage('https://i.imgur.com/hmSiobB.png') //Fafnir
			//.setImage('https://i.imgur.com/7h9MTPK.png') //Jormungandr
			//.setImage('https://i.imgur.com/Olhsu5G.png') //Ogre
			//.setImage('https://i.imgur.com/XRRAUeD.png') //Rafflesia
			.setImage('https://i.imgur.com/gUnyHT3.png') //Surtr
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
		
		client.channels.cache.get(config.raidchannelid).send(embed);
	});
	
	//Squirm Timer
	cron.schedule('30 0,2,4,9,12,16,18,20,22 * * *', () => {
		const embed = new Discord.MessageEmbed()
			.setColor('#e25822')
			.addFields(
				{ name: 'Guerilla Notification', value: 'Swords and shields? Can we use those to bake a pie, Brother?' },
			)
			.setImage('https://i.imgur.com/5NqgkOT.png')
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
		
		client.channels.cache.get(config.squirmchannelid).send(embed);
	});

	//Daily Rollover Timer
	cron.schedule('0 5 * * *', () => {
		const embed = new Discord.MessageEmbed()
			.setColor('#d3d3d3')
			.addFields(
				{ name: 'Daily Rollover Notification', value: 'It\'s a new day brother, rise and shine!' },
			)
			.setImage('https://i.imgur.com/P1ON6tb.png')
			.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
	
		client.channels.cache.get(config.generalchannelid).send(embed);
	});

	//Event Schedule
	cron.schedule('0 15 * * *', () => {
		var events = [
			'Evolution Mysteries - Wind, Secret to Riches', //Sunday
			'Evolution Mysteries - Fire, Evolution Oddities - Armor', //Monday
			'Evolution Mysteries - Water, Evolution Mysteries - Wind', //Tuesday
			'Evolution Mysteries - Fire, Evolution Oddities - Armor', //Wednesday
			'Evolution Mysteries -  Water, Secret to Riches', //Thursday
			'Evolution Mysteries - Wind, Evolution Oddities - Armor, Secret to Riches', //Friday
			'Evolution Mysteries - Fire, Evolution Mysteries - Water' //Saturday
		]
		
		var date = new Date();

		const embed = new Discord.MessageEmbed()
		.setColor('#d3d3d3')
		.addFields(
			{ name: 'Daily Events Notification', value: `Today\'s events are:\n${events[date.getDay()]}`},
		)
		.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');

		client.channels.cache.get(config.generalchannelid).send(embed);
	});

});

//Welcome message
client.on('guildMemberAdd', member => {
	var welcomeMessages = [
		`Brother... Did ${member.name} follow our trail of breadcrumbs to get here?`,
		`Did you get lost in the woods too, ${member.name}? Can you help me find my Brother?`,
		`Are you feeling hungry, ${member.name}? By the smell of the oven, dinner's almost done!`
	]

	var randomNumber = Math.floor(Math.random()*welcomeMessages.length);

	const embed = new Discord.MessageEmbed()
		.setColor('#ffffff')
		.addFields(
			{ name: 'Welcome!', value: `${welcomeMessages[randomNumber]}` },
		)
		.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');
	
	client.channels.cache.get(config.generalchannelid).send(embed);

	//Add Friend role
	member.roles.add('767853184059965522');
});

//Leave message
client.on('guildMemberRemove', member => {
	client.channel.cache.get(config.leaderchannelid).send(`${member.name} left the server.`)
});

//Log into Discord service using bot token
client.login(token);

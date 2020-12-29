module.exports = {
	name: 'remy',
	aliases: ['Remy','REMY'],
    description: 'Remy!',
    cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');

		const embed = new Discord.MessageEmbed()
		.setColor('#FFC0CB')
		.addFields(
			{ name: 'Remy\'s Thoughts', value: 'Bork!' },
		)
		.setImage('https://i.imgur.com/3BrpZ43.jpg')
		.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');

		message.channel.send(embed);
	},
};
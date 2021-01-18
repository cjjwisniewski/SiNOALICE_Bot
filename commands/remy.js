module.exports = {
	name: 'remy',
	aliases: ['Remy','REMY'],
    description: 'Remy!',
    cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');

		var pics = [
            'https://i.imgur.com/3BrpZ43.jpg',
            'https://i.imgur.com/InBNF9Y.jpg'
		]
		
		var randomNumber = Math.floor(Math.random()*pics.length);

		var selectedPic = pics[randomNumber];

		const embed = new Discord.MessageEmbed()
		.setColor('#FFC0CB')
		.addFields(
			{ name: 'Remy\'s Thoughts', value: 'Bork!' },
		)
		.setImage(selectedPic)
		.setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');

		message.channel.send(embed);
	},
};
module.exports = {
    name: 'eventschedule',
    aliases: ['schedule','events'],
    description: 'Rotating daily event schedule',
    cooldown: 5,
	execute(message, args) {
		const Discord = require('discord.js');

		const embed = new Discord.MessageEmbed()
            .setColor('#FFFFFF')
            .setTitle('Event Schedule')
            .setURL('https://sinoalice.game-db.tw/timer')
            .addFields(
                { name: 'Sunday', value: 'Evolution Mysteries - Wind, Secret to Riches'},
                { name: 'Monday', value: 'Evolution Mysteries - Fire, Evolution Oddities - Armor'},
                { name: 'Tuesday', value: 'Evolution Mysteries - Water, Evolution Mysteries - Wind'},
                { name: 'Wednesday', value: 'Evolution Mysteries - Fire, Evolution Oddities - Armor'},
                { name: 'Thursday', value: 'Evolution Mysteries -  Water, Secret to Riches'},
                { name: 'Friday', value: 'Evolution Mysteries - Wind, Evolution Oddities - Armor, Secret to Riches'},
                { name: 'Saturday', value: 'Evolution Mysteries - Fire, Evolution Mysteries - Water'}
            )
            .setFooter('Undo', 'https://i.imgur.com/2WLV7km.png');

        message.channel.send(embed);
	},
};
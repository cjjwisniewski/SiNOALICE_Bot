module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	guildOnly: true,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		const member = message.mentions.users.first();

		//member.kick();
		message.channel.send(`${message.author} kicked ${member.username}`);
	},
};
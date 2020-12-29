// https://github.com/discordjs/guide/blob/master/code-samples/command-handling/adding-features/12/commands/server.js

module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	execute(message) {
		message.author.send(`Server name: ${message.guild.name}\nServer ID: ${message.guild.id}\nTotal members: ${message.guild.memberCount}`);
		message.delete();
	},
};
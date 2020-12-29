// https://github.com/discordjs/guide/blob/master/code-samples/command-handling/adding-features/12/commands/server.js

module.exports = {
	name: 'channel',
	description: 'Display info about this channel.',
	execute(message) {
        message.author.send(`Channel Name: ${message.channel.name}\nChannel ID: ${message.channel.id}`);
        message.delete();
	},
};
// https://github.com/discordjs/guide/blob/master/code-samples/command-handling/adding-features/12/commands/user-info.js

module.exports = {
	name: 'user-info',
	description: 'Display info about yourself.',
	execute(message) {
		message.author.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
		message.delete();
	},
};
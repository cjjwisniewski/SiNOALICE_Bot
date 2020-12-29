module.exports = {
	name: 'removerole',
	aliases: ['title'],
    description: 'Removes a role from the mentioned user',
    cooldown: 5,
	execute(message, args) {
		if(!args.length) {
			return message.channel.send('Please provide arguments for [tagged user] and [role]')
		}
	
		let member = message.mentions.members.first();
		let role = message.mentions.roles.first();
		member.roles.remove(role);
	},
};
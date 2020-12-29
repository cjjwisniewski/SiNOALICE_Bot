module.exports = {
	name: 'permissions',
	description: 'Gets permissions for the tagged user',
	execute(message, args) {
        if(!args.length) {
			return message.channel.send('Please provide arguments for [tagged user] and [channel]')
		}

        const member = message.mentions.members.first();
        const channel = message.channel.id;
        const permissions = member.permissionsIn(channel).toArray().join('\n');
        message.author.send(`${member} has the following permissions in ${message.channel.name}:\n${permissions}`);
		message.delete();
	},
};
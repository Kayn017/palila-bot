const Discord = require("discord.js");

function getAllPermissions(...collections) {

	const permissions = [];

	for (const collection of collections) {

		if (!(collection instanceof Discord.Collection))
			throw new Error("The given argument is not a discord collection.");

		collection.forEach(item => {
			if (item.subcommands)
				permissions.push(...getCommandPermissions(item));
			else
				for (const perms of item.permissions) {
					if (!permissions.includes(perms))
						permissions.push(perms);
				}
		});
	}

	return permissions;
}

function getCommandPermissions(command) {

	if (!command.subcommands)
		return command.permissions;

	const permissions = [...command.permissions];
	command.subcommands.forEach(subcmd => {
		for (const intent of getCommandPermissions(subcmd)) {
			if (!permissions.includes(intent)) {
				permissions.push(intent);
			}
		}
	});

	return permissions;
}

module.exports = {
	getAllPermissions
};
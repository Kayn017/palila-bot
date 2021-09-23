const Discord = require("discord.js");

function getAllPermissions(...collections) {

	const permissions = [];

	for (const collection of collections) {

		if (!(collection instanceof Discord.Collection))
			throw new Error("The given argument is not a discord collection.");

		collection.forEach(item => {
			for (const perm of item.permissions) {
				if (!permissions.includes(perm))
					permissions.push(perm);
			}
		});
	}

	return permissions;
}

function getCommandPermissions(command) {

	if (!command.subcommands)
		return command.permissions;

	const perms = [...command.permissions];

	command.subcommands.forEach(subcmd => {
		for (const perm of getCommandPermissions(subcmd)) {
			if (!perms.includes(perm)) {
				perms.push(perm);
			}
		}
	});

	return perms;
}



module.exports = {
	getAllPermissions,
	getCommandPermissions
};
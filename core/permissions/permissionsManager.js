const Discord = require("discord.js");


function getAllPermissions(...collections) {

	const permissions = [];

	for (const collection of collections) {

		if (!(collection instanceof Discord.Collection))
			throw new Error("The given argument is not a discord collection.");

		collection.forEach(item => {
			for (const perm of item.permissions) {
				if (!permissions.includes(perm))
					permissions.push(perm)
			}
		})
	}

	return permissions;
}

module.exports = {
	getAllPermissions
}
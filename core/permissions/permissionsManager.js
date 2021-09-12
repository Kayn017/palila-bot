const Discord = require("discord.js");
const fs = require("fs");
const color = require("../../config/config.json").color;
const { debug, err } = require("../../services/log");
const { Permissions } = require("discord.js");

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

async function manageBotRole(client) {

	const OAuth2guilds = await client.guilds.fetch();

	OAuth2guilds.each(async g => {

		const guild = await client.guilds.fetch(g.id);

		const config = JSON.parse(fs.readFileSync(`./guilds/${guild.id}/config.json`));

		if (!config.botRole || !guild.roles.cache.find(r => r.id === config.botRole)) {

			let role;

			try {
				role = await guild.roles.create({
					name: client.user.username,
					color,
					reason: "Ce rôle sert à s'assurer que le bot fonctionne correctement",
					permissions: [Permissions.FLAGS.MANAGE_ROLES, ...client.permissions]
				});

				const member = await guild.members.fetch(client.user);
				await member.roles.add(role);
			}
			catch (e) {
				return err(`Impossible de créer un rôle pour le bot ou de lui attribuer sur le serveur ${guild.name}`, "permissionsManager", undefined, e.stack);
			}

			config.botRole = role.id;
			fs.writeFileSync(`./guilds/${guild.id}/config.json`, JSON.stringify(config));

			debug(`Création du role ${role.name} pour le serveur ${guild.name}`, "permissionsManager");
		}
		else {
			guild.roles.edit(config.botRole, {
				name: client.user.username,
				color,
				reason: "Ce rôle sert à s'assurer que le bot fonctionne correctement",
				permissions: [Permissions.FLAGS.MANAGE_ROLES, ...client.permissions]
			});
		}

	});

}




module.exports = {
	getAllPermissions,
	getCommandPermissions,
	manageBotRole
};
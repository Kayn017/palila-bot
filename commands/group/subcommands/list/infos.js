const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "list",
	description: "affiche la liste des rôles disponibles",
	explication: "Cette commande affiche la liste des rôles disponibles",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILDS
	],
	permissions: [
		Permissions.FLAGS.MANAGE_ROLES
	],
	configurations: [],
};

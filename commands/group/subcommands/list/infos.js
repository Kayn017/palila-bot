const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "list",
	description: "affiche la liste des rôles disponibles",
	explication: "Cette commande affiche la liste des rôles disponibles",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [
		PermissionFlagsBits.ManageRoles
	],
	globalCommand: false
};

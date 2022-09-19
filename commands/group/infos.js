const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "group",
	description: "Vous met dans un groupe",
	explication: "Cette commande sert a la gestion des groupes.",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [
		PermissionFlagsBits.ManageGuild
	],
	globalCommand: false,
};

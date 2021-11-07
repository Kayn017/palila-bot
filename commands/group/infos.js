const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "group",
	description: "Vous met dans un groupe",
	explication: "Cette commande sert a la gestion des groupes.",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILDS
	],
	permissions: [
		Permissions.FLAGS.MANAGE_GUILD
	],
	configurations: [],
	globalCommand: false
};

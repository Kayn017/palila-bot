const { Intents } = require("discord.js");

module.exports = {
	name: "config",
	description: "Commande de configuration du bot",
	explication: "Cette commande sert à configurer le bot.",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILDS
	],
	permissions: [],
	configurations: [],
	globalCommand: true
};

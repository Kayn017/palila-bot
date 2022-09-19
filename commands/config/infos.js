const { GatewayIntentBits } = require("discord.js");

module.exports = {
	name: "config",
	description: "Commande de configuration du bot",
	explication: "Cette commande sert à configurer le bot.",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [],
	configurations: [],
	globalCommand: true
};

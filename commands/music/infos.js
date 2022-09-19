const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "music",
	description: "Commande pour écouter de la musique",
	explication: "Commande pour écouter de la musique",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.GuildVoiceStates
	],
	permissions: [
		PermissionFlagsBits.Speak
	],
	globalCommand: true,
};

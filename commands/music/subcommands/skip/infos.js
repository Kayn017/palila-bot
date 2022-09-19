const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "skip",
	description: "Passe a la chanson suivante",
	explication: "Passe a la chanson suivante",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.GuildVoiceStates
	],
	permissions: [
		PermissionFlagsBits.Speak,
	],
	globalCommand: true,
};

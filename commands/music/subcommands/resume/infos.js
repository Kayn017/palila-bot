const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "resume",
	description: "Rejoue la musique actuelle",
	explication: "Rejoue la musique actuelle",
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

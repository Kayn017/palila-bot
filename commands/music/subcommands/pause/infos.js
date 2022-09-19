const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "pause",
	description: "Met en pause la musique actuelle",
	explication: "Met en pause la musique actuelle",
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

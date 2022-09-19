const { GatewayIntentBits, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "play",
	description: "Joue une musique",
	explication: "Joue une musique",
	author: "Kayn",
	options: [{
		name: "url",
		type: ApplicationCommandOptionType.String,
		description: "Lien de la musique a jouer",
		required: true
	}],
	intents: [
		GatewayIntentBits.GuildVoiceStates
	],
	permissions: [
		PermissionFlagsBits.Speak,
	],
	globalCommand: true,
};

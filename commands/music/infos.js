const { Permissions, Intents } = require("discord.js");

module.exports = {
	name: "music",
	description: "Commande pour écouter de la musique",
	explication: "Commande pour écouter de la musique",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	permissions: [
		Permissions.FLAGS.SPEAK
	],
	globalCommand: true,
};

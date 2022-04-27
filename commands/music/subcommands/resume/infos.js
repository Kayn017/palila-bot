const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "resume",
	description: "Rejoue la musique actuelle",
	explication: "Rejoue la musique actuelle",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	permissions: [
		Permissions.FLAGS.SPEAK,
	],
	globalCommand: true,
};

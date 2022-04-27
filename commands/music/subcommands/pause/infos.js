const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "pause",
	description: "Met en pause la musique actuelle",
	explication: "Met en pause la musique actuelle",
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

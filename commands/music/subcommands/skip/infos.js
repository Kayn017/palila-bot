const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "skip",
	description: "Passe a la chanson suivante",
	explication: "Passe a la chanson suivante",
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

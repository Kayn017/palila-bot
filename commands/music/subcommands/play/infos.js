const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "play",
	description: "Joue une musique",
	explication: "Joue une musique",
	author: "Kayn",
	options: [{
		name: "url",
		type: "STRING",
		description: "Lien de la musique a jouer",
		required: true
	}],
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	permissions: [
		Permissions.FLAGS.SPEAK,
	],
	globalCommand: true,
};

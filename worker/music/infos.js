const { Intents } = require("discord.js");

module.exports = {
	name: "music",
	description: "",
	author: "Kayn",
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILDS
	],
	exitAfterLaunch: false
};

const { Intents } = require("discord.js");

module.exports = {
	name: "downloader",
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	exitAfterLaunch: true
};
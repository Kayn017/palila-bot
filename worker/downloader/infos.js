const { GatewayIntentBits } = require("discord.js");


module.exports = {
	name: "downloader",
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages
	],
	exitAfterLaunch: true
};
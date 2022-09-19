const { GatewayIntentBits } = require("discord.js");

module.exports = {
	name: "music",
	description: "",
	author: "Kayn",
	intents: [
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.Guilds
	],
	exitAfterLaunch: false
};

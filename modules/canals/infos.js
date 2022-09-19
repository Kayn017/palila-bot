const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "canals",
	description: "Met en commun plusieurs channels de plusieurs serveurs",
	explication: "",
	author: "Kayn",
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildWebhooks
	],
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ViewChannel
	],
};

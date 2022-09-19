const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "lynch",
	description: "La loterie de lynch",
	explication: "BEAUTIFUL BLUE SKIES AND GOLDEN SUNSHINE ALL ALONG THE WAY",
	author: "Kayn",
	intents: [
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages
	],
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.AddReactions
	],
};

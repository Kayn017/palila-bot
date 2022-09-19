const { GatewayIntentBits, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "jokes",
	description: "C'est quoi ? feur",
	explication: "",
	author: "Kayn & TinouHD & M4x1m3 & Augustin",
	intents: [
		GatewayIntentBits.GuildMessages
	],
	permissions: [
		PermissionFlagsBits.SendMessages
	],
};

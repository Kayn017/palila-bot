const { GatewayIntentBits, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "backupchannel",
	description: "Permet de télécharger toutes les images d'un channel",
	explication: "",
	author: "Kayn",
	options: [{
		name: "salon",
		type: ApplicationCommandOptionType.Channel,
		description: "Salon à télécharger",
		required: false,
		choices: []
	}],

	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages
	],
	permissions: [
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.SendMessages
	],
	globalCommand: true,
};

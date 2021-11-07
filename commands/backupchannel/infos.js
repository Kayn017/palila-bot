const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "backupchannel",
	description: "Permet de télécharger toutes les images d'un channel",
	explication: "",
	author: "Kayn",
	options: [{
		name: "salon",
		type: "CHANNEL",
		description: "Salon à télécharger",
		required: false,
		choices: []
	}],

	intents: [
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	permissions: [
		Permissions.FLAGS.READ_MESSAGE_HISTORY,
		Permissions.FLAGS.VIEW_CHANNEL,
		Permissions.FLAGS.SEND_MESSAGES
	],
	configurations: [],
	globalCommand: true,
};

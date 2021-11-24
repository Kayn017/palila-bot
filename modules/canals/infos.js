const { Permissions, Intents } = require("discord.js");

module.exports = {
	name: "canals",
	description: "Met en commun plusieurs channels de plusieurs serveurs",
	explication: "",
	author: "Kayn",
	intents: [
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_WEBHOOKS
	],
	permissions: [
		Permissions.FLAGS.SEND_MESSAGES,
		Permissions.FLAGS.VIEW_CHANNEL
	],
};

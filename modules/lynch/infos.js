const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "lynch",
	description: "La loterie de lynch",
	explication: "BEAUTIFUL BLUE SKIES AND GOLDEN SUNSHINE ALL ALONG THE WAY",
	author: "Kayn",
	intents: [
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	],
	permissions: [
		Permissions.FLAGS.SEND_MESSAGES,
		Permissions.FLAGS.VIEW_CHANNEL,
		Permissions.FLAGS.ADD_REACTIONS
	],
};

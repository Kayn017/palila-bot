const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "jokes",
	description: "C'est quoi ? feur",
	explication: "",
	author: "Kayn & TinouHD & M4x1m3 & Augustin",
	intents: [
		Intents.FLAGS.GUILD_MESSAGES
	],
	permissions: [
		Permissions.FLAGS.SEND_MESSAGES
	],
};

const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "disconnect",
	description: "Déconnecte un channel du canal ou il est connecté",
	explication: "",
	author: "Kayn",
	options: [{
		name: "salon",
		type: ApplicationCommandOptionType.Channel,
		description: "Channel a déconnecter",
		required: false,
	}],
	intents: [],
	permissions: [],
	globalCommand: false,
};

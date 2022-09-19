const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "create",
	description: "Créé un canal",
	explication: "",
	author: "Kayn",
	options: [{
		name: "nom",
		type: ApplicationCommandOptionType.String,
		description: "Nom du canal",
		required: true
	}],
	intents: [],
	permissions: [],
	globalCommand: false,
};

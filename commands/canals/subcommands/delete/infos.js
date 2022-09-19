const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "delete",
	description: "Supprime un canal (utilisateur god only)",
	explication: "",
	author: "Kayn",
	options: [{
		name: "canal",
		type: ApplicationCommandOptionType.String,
		description: "Canal a supprimer",
		required: true,
		choices: []
	}],
	intents: [],
	permissions: [],
	globalCommand: false,
};

const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "history",
	description: "Affiche l'historique des votes d'une personne",
	explication: "Affiche l'historique des votes d'une personne",
	author: "Kayn",
	options: [{
		name: "personne",
		type: ApplicationCommandOptionType.User,
		description: "Personne dont on veut voir l'historique",
		required: false,
		choices: [],
	}],
	intents: [],
	permissions: [],
	globalCommand: true,
};

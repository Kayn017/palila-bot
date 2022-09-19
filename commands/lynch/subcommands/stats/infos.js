const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "stats",
	description: "Pleins de stats sur la loterie de lynch",
	explication: "Pleins de stats sur la loterie de lynch",
	author: "Kayn",
	options: [{
		name: "personne",
		type: ApplicationCommandOptionType.User,
		description: "Personne dont on veut voir (peut être) une stat",
		required: false,
		choices: [],
	}, {
		name: "stat",
		type: ApplicationCommandOptionType.String,
		description: "La stat a afficher",
		choices: []
	}],
	intents: [],
	permissions: [],
	globalCommand: true,
};

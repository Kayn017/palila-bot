const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "connect",
	description: "Connecte un channel à un canal",
	explication: "",
	author: "Kayn",
	options: [{
		name: "canal",
		type: ApplicationCommandOptionType.String,
		description: "Canal a connecter",
		required: true,
		choices: []
	},
	{
		name: "salon",
		type: ApplicationCommandOptionType.Channel,
		description: "Channel a connecter",
		required: false
	}],
	intents: [],
	permissions: [],
	globalCommand: false,
};

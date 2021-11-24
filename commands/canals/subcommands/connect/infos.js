module.exports = {
	name: "connect",
	description: "Connecte un channel à un canal",
	explication: "",
	author: "Kayn",
	options: [{
		name: "canal",
		type: "STRING",
		description: "Canal a connecter",
		required: true,
		choices: []
	},
	{
		name: "salon",
		type: "CHANNEL",
		description: "Channel a connecter",
		required: false
	}],
	intents: [],
	permissions: [],
	configurations: [],
	globalCommand: false,
};

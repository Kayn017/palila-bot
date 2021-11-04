module.exports = {
	name: "help",
	description: "L'aide de ce bot",
	explication: "Cette commande affiche l'aide du bot et les explications des commandes du bot.",
	author: "Kayn",
	options: [{
		name: "commande",
		type: "STRING",
		description: "Nom de la commande dont vous voulez voir l'aide",
		required: false,
		choices: []
	}],
	intents: [],
	permissions: [],
	configurations: [],
	globalCommand: true
};

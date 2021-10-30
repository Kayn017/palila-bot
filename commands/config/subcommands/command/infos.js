module.exports = {
	name: "command",
	description: "Configure les commandes du bot",
	explication: "Cette commande sert à configurer le fonctionnement du bot",
	author: "Kayn",
	options: [{
		name: "propriete",
		type: "STRING",
		description: "Propriété à configurer",
		required: true,
		choices: []
	},
	{
		name: "valeur",
		type: "STRING",
		description: "Valeur de la propriété",
		required: true,
		choices: []
	}],
	intents: [],
	permissions: [],
	configurations: [],
};

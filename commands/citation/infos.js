module.exports = {
	name: "citation",
	description: "Renvoie une citation prise hors contexte",
	explication: "Renvoie une citation prise hors contexte",
	author: "Kayn",
	options: [{
		name: "citation",
		type: "ATTACHMENT",
		description: "citation à ajouter",
		required: false
	}, {
		name: "personne",
		type: "STRING",
		description: "personne concernée par la citation",
		required: false 
	}, {
		name: "contenu",
		type: "STRING",
		description: "ce qui est écrit ou dis dans la citation",
		required: false
	}],
	intents: [],
	permissions: [],
	globalCommand: true,
};

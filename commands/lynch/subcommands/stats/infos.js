module.exports = {
	name: "stats",
	description: "Pleins de stats sur la loterie de lynch",
	explication: "Pleins de stats sur la loterie de lynch",
	author: "Kayn",
	options: [{
		name: "personne",
		type: "USER",
		description: "Personne dont on veut voir (peut être) une stat",
		required: false,
		choices: [],
	}, {
		name: "stat",
		type: "STRING",
		description: "La stat a afficher",
		choices: []
	}],
	intents: [],
	permissions: [],
	globalCommand: true,
};

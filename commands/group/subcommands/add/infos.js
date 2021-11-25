const { Permissions } = require("discord.js");

module.exports = {
	name: "add",
	description: "Permet de s'ajouter un role",
	explication: "Cette commande permet d'ajouter la personne qui l'utilise à un groupe",
	author: "Kayn",
	options: [
		{
			name: "groupe",
			type: "STRING",
			description: "Groupe à s'ajouter",
			required: true,
			choices: [],
		},
	],
	intents: [],
	permissions: [
		Permissions.FLAGS.MANAGE_ROLES
	],
	globalCommand: false,
};

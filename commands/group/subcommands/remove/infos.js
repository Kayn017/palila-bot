const { Permissions } = require("discord.js");

module.exports = {
	name: "remove",
	description: "permet de supprimer un rôle qu'on possède",
	explication: "Cette commande permet de s'enlever un rôle",
	author: "Kayn",
	options: [
		{
			name: "groupe",
			type: "STRING",
			description: "Groupe à s'enlever",
			required: true,
			choices: [],
		},
	],
	intents: [],
	permissions: [
		Permissions.FLAGS.MANAGE_ROLES
	],
	configurations: [],
};

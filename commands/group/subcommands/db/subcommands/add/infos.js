const { Permissions } = require("discord.js");

module.exports = {
	name: "add",
	description: "Créé un nouveau groupe (admin only)",
	explication: "Cette commande permet de créer un groupe",
	author: "Kayn",
	options: [
		{
			name: "nom",
			type: "STRING",
			description: "Nom du groupe à créer",
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

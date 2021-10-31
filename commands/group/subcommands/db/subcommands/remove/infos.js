const { Permissions } = require("discord.js");

module.exports = {
	name: "remove",
	description: "Supprime un groupe (admin only)",
	explication: "Cette commande permet de supprimer un groupe",
	author: "Kayn",
	options: [{
		name: "groupe",
		type: "STRING",
		description: "Groupe à supprimer",
		required: true,
		choices: []
	}],
	intents: [],
	permissions: [
		Permissions.FLAGS.MANAGE_ROLES
	],
	configurations: [],
};

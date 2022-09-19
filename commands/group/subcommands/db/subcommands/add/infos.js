const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "add",
	description: "Créé un nouveau groupe (admin only)",
	explication: "Cette commande permet de créer un groupe",
	author: "Kayn",
	options: [
		{
			name: "nom",
			type: ApplicationCommandOptionType.String,
			description: "Nom du groupe à créer",
			required: true,
			choices: [],
		},
	],
	intents: [],
	permissions: [
		PermissionFlagsBits.ManageRoles
	],
	globalCommand: false
};

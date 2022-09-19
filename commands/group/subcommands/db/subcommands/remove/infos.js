const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "remove",
	description: "Supprime un groupe (admin only)",
	explication: "Cette commande permet de supprimer un groupe",
	author: "Kayn",
	options: [
		{
			name: "groupe",
			type: ApplicationCommandOptionType.String,
			description: "Groupe à supprimer",
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

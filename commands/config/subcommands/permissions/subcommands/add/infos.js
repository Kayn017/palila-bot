const { GatewayIntentBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "add",
	description: "Autorise un rôle à configurer le bot",
	explication: "Cette sous commande permet de donner le droit de configurer le bot a un rôle donné en paramètre.",
	author: "Kayn",
	options: [{
		name: "role",
		type: ApplicationCommandOptionType.Role,
		description: "Rôle à autoriser",
		required: true
	}],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [],
	globalCommand: true
};

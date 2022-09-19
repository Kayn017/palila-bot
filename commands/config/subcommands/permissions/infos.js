const { GatewayIntentBits } = require("discord.js");

module.exports = {
	name: "permissions",
	description: "Sous commande pour les permissions de configuration du bot",
	explication: "Cette commande permet de gérer les permissions de configuration",
	author: "Kayn",
	options: [],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [],
	globalCommand: true
};

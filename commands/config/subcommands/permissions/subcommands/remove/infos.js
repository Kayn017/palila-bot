const { GatewayIntentBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "remove",
	description: "Retire les permissions de configuration du bot à un rôle",
	explication: "Cette sous commande permet de retirer les permissions de configurations du bot à un rôle",
	author: "Kayn",
	options: [{
		name: "role",
		type: ApplicationCommandOptionType.Role,
		description: "Rôle à retirer.",
		required: true
	}],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [],
	globalCommand: true
};

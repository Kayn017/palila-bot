const { GatewayIntentBits, PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "nickname",
	description: "Change le pseudo de la personne qui tape la commande",
	explication: "Cette commande permet de changer le pseudo de la personne qui fait la commande. Taper la commande sans option enlève le pseudo",
	author: "Kayn",
	options: [{
		name: "surnom",
		type: ApplicationCommandOptionType.String,
		description: "Nouveau surnom",
		required: false
	}],
	intents: [
		GatewayIntentBits.GuildMembers
	],
	permissions: [
		PermissionFlagsBits.ChangeNickname
	],
	globalCommand: true
};

const { GatewayIntentBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "poll",
	description: "Créé un sondage",
	explication: "Cette commande permet de créer un sondage.",
	author: "Kayn",
	options: [
		{
			name: "intitule",
			type: ApplicationCommandOptionType.String,
			description: "Intitulé du sondage",
			required: true,
		},
		{
			name: "choix1",
			type: ApplicationCommandOptionType.String,
			description: "Choix 1",
			required: true,
		},
		{
			name: "choix2",
			type: ApplicationCommandOptionType.String,
			description: "Choix 2",
			required: true,
		},
		{
			name: "choix3",
			type: ApplicationCommandOptionType.String,
			description: "Choix 3",
			required: false,
		},
		{
			name: "choix4",
			type: ApplicationCommandOptionType.String,
			description: "Choix 4",
			required: false,
		},
		{
			name: "choix5",
			type: ApplicationCommandOptionType.String,
			description: "Choix 5",
			required: false,
		},
		{
			name: "duree",
			type: ApplicationCommandOptionType.String,
			description: "Durée du sondage (format `<nombre><unité>` exemple : 10s, 3h)",
			required: false,
		},
	],
	intents: [
		GatewayIntentBits.Guilds
	],
	permissions: [],
	globalCommand: true,
};

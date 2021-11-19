const { Intents } = require("discord.js");

module.exports = {
	name: "poll",
	description: "Créé un sondage",
	explication: "Cette commande permet de créer un sondage.",
	author: "Kayn",
	options: [
		{
			name: "intitule",
			type: "STRING",
			description: "Intitulé du sondage",
			required: true,
		},
		{
			name: "choix1",
			type: "STRING",
			description: "Choix 1",
			required: true,
		},
		{
			name: "choix2",
			type: "STRING",
			description: "Choix 2",
			required: true,
		},
		{
			name: "choix3",
			type: "STRING",
			description: "Choix 3",
			required: false,
		},
		{
			name: "choix4",
			type: "STRING",
			description: "Choix 4",
			required: false,
		},
		{
			name: "choix5",
			type: "STRING",
			description: "Choix 5",
			required: false,
		},
		{
			name: "duree",
			type: "STRING",
			description: "Durée du sondage (format `<nombre><unité>` exemple : 10s, 3h)",
			required: false,
		},
	],
	intents: [Intents.FLAGS.GUILDS],
	permissions: [],
	configurations: [],
	globalCommand: true,
};

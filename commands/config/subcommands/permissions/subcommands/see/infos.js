const { Intents } = require("discord.js");

module.exports = {
	name: "see",
	description: "Envoie la liste des rôles pouvant modifier le bot sur ce serveur.",
	explication: "Cette sous commande permet d'afficher la liste des rôles ayant les droits pour modifier la configuration du bot",
	author: "Kayn",
	options: [],
	intents: [
		Intents.FLAGS.GUILDS
	],
	permissions: [],
	configurations: [],
};

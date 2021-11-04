const { Intents, Permissions } = require("discord.js");

module.exports = {
	name: "nickname",
	description: "Change le pseudo de la personne qui tape la commande",
	explication: "Cette commande permet de changer le pseudo de la personne qui fait la commande. Taper la commande sans option enlève le pseudo",
	author: "Kayn",
	options: [{
		name: "surnom",
		type: "STRING",
		description: "Nouveau surnom",
		required: false
	}],
	intents: [
		Intents.FLAGS.GUILD_MEMBERS
	],
	permissions: [
		Permissions.FLAGS.CHANGE_NICKNAME
	],
	configurations: [
		"keepPseudo"
	],
	globalCommand: true
};

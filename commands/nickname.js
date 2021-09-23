/********** REQUIRE **********/
const Discord = require("discord.js");
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const fs = require("fs");
const { err } = require("../services/log");


/********** INFORMATIONS **********/
const name = "nickname";
const description = "Change le pseudo de la personne qui a fait la commande";
const explication = "Cette commande permet de changer le pseudo de la personne qui fait la commande";
const author = "Kayn";
const options = [{
	name: "surnom",
	type: "STRING",
	description: "Nouveau surnom",
	required: false
},
{
	name: "remove",
	type: "BOOLEAN",
	description: "Enleve votre pseudo et remet celui de base",
	required: false
}];


/********** PERMISSIONS **********/
const intents = [
	Intents.FLAGS.GUILD_MEMBERS
];
const permissions = [
	Permissions.FLAGS.CHANGE_NICKNAME
];


/********** VALUES **********/
const NICKNAME_MAX_SIZE = 32;


/********** ACTIONS **********/
async function execute(interaction, options) {

	const newNickname = options.find(o => o.name === "surnom")?.value;
	const remove = options.find(o => o.name === "remove")?.value;

	if (!newNickname && remove === undefined)
		return interaction.reply({ content: "Faut faire un choix hein", ephemeral: true });

	const config = JSON.parse(fs.readFileSync(`./guilds/${interaction.guild.id}/config.json`));

	const actualNickname = interaction.member.nickname ?? "";
	const name = actualNickname.includes("/") ? actualNickname.split("/").pop().trim() : actualNickname;

	let newGuildNickname;

	if (remove) {
		if (config.commands.nickname.keepPseudo)
			newGuildNickname = name;
		else
			newGuildNickname = null;
	}
	else if (newNickname) {
		if (config.commands.nickname.keepPseudo)
			newGuildNickname = `${newNickname} / ${name}`;
		else
			newGuildNickname = newNickname;

		if (newGuildNickname.length > NICKNAME_MAX_SIZE)
			return interaction.reply({ content: "Ce pseudo est trop long :/", ephemeral: true });
	} else {
		return interaction.reply({ content: "🤨", ephemeral: true });
	}


	interaction.member.setNickname(newGuildNickname).then(() => {
		if (newGuildNickname)
			interaction.reply({ content: "Pseudo changé !", ephemeral: true });
		else
			interaction.reply({ content: "Pseudo enleve !", ephemeral: true });

	})
		.catch(e => {
			if (e instanceof Discord.DiscordAPIError && e.message === "Missing Permissions")
				interaction.reply({ content: "Je n'ai pas les permissions pour te renommer :/ Regarde avec les admins de ton serveur pour me mettre les permissions", ephemeral: true });
			else {
				err("Impossible de changer le nickname", "nickname", interaction, e.stack);
				interaction.reply({ content: "Y'a problème la :thinking:", ephemeral: true });
			}
		});
}

function init() { }

function shutdown() { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown };
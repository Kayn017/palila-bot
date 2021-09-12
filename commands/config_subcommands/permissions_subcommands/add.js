/********** REQUIRE **********/
const Discord = require("discord.js");
const { havePermission } = require("../../../services/permissions");
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const fs = require("fs");
const { log } = require("../../../services/log");

/********** INFORMATIONS **********/
const name = "add";
const description = "Autorise un rôle à configurer le bot";
const explication = "Cette sous commande permet de donner le droit de configurer le bot a un rôle donné en paramètre";
const author = "Kayn";
const options = [{
	name: "role",
	type: "ROLE",
	description: "Rôle à autoriser",
	required: true
}];


/********** PERMISSIONS **********/
const intents = [
	Intents.FLAGS.GUILDS
];
const permissions = [];


/********** ACTIONS **********/
async function execute(interaction, options) {

	if (interaction.channel.type === "dm")
		return interaction.reply({ content: "Cette commande ne peut pas être utilisé en MP.", ephemeral: true });

	if (!havePermission(interaction.user.id, interaction.guildId, interaction.member._roles) && interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR, true))
		return interaction.reply({ content: "Vous n'avez pas les droits pour executer cette commande.", ephemeral: true });

	const config = JSON.parse(fs.readFileSync(`./guilds/${interaction.guild.id}/config.json`));

	config.adminRoles.push(options[0].role.id);

	fs.writeFileSync(`./guilds/${interaction.guild.id}/config.json`, JSON.stringify(config));

	log(`Ajout du role ${options[0].role.name} parmi les roles administrateurs. (id: ${options[0].role.id})`, "add", interaction);

	interaction.reply({ content: `Le rôle ${options[0].role.name} a été ajouté aux roles administrateurs !`, ephemeral: true });
}

function init() { }

function shutdown() { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown };
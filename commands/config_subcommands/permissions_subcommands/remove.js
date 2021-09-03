/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const { havePermission } = require('../../../services/permissions');
const fs = require('fs');
const { log } = require('../../../services/log');

/********** INFORMATIONS **********/
const name = "remove";
const description = "Retire les permissions de configuration du bot à un rôle";
const explication = "Cette sous commande permet de retirer les permissions de configurations du bot à un rôle";
const author = "Kayn";
const options = [{
	name: "role",
	type: "ROLE",
	description: "Rôle à retirer.",
	required: true
}];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [];


/********** ACTIONS **********/
async function execute(interaction, options) {

	if (!havePermission(interaction.user.id, interaction.guildId, interaction.member._roles) && interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR, true))
		return interaction.reply({ content: "Vous n'avez pas les droits pour executer cette commande.", ephemeral: true });

	const config = JSON.parse(fs.readFileSync(`./guilds/${interaction.guild.id}/config.json`));

	if (config.adminRoles.includes(options[0].value)) {
		config.adminRoles.splice(config.adminRoles.indexOf(options[0].value), 1);
		log(`Suppression du role ${options[0].role.name} des roles admin (id: ${options[0].value})`, "remove", interaction);
		interaction.reply({ content: `Le rôle ${options[0].role.name} a été enlevé des rôles pouvant configurer le bot`, ephemeral: true });
	}
	else {
		interaction.reply({ content: `Le rôle ${options[0].role.name} ne permet pas de configurer le bot`, ephemeral: true });
	}

	fs.writeFileSync(`./guilds/${interaction.guild.id}/config.json`, JSON.stringify(config));
}

function init(client) { }

function shutdown(client) { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }
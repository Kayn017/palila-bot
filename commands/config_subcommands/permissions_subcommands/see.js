/********** REQUIRE **********/
const Discord = require("discord.js");
const Intents = Discord.Intents;
const fs = require("fs");
const { color } = require("../../../config/config.json");

/********** INFORMATIONS **********/
const name = "see";
const description = "Envoie la liste des rôles pouvant modifier le bot sur ce serveur.";
const explication = "Cette sous commande permet d'afficher la liste des rôles ayant les droits pour modifier la configuration du bot";
const author = "Kayn";
const options = [];


/********** PERMISSIONS **********/
const intents = [
	Intents.FLAGS.GUILDS
];
const permissions = [];


/********** ACTIONS **********/
async function execute(interaction) {

	if (interaction.channel.type === "dm")
		return interaction.reply({ content: "Cette commande ne peut pas être utilisé en MP.", ephemeral: true });

	const config = JSON.parse(fs.readFileSync(`./guilds/${interaction.guildId}/config.json`));

	const rolesNames = [];

	for (const roleID of config.adminRoles) {

		const roles = await interaction.guild.roles.fetch(roleID);
		rolesNames.push(roles.name);

	}

	const embed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle("Liste des roles admin de ce serveur");

	let text = "";

	if (rolesNames.length === 0) {
		text = "Aucun autre rôle n'a les droits pour modifier le bot.";
	}
	else {
		for (const roleName of rolesNames) {
			text = text + `\n- ${roleName}`;
		}
	}

	embed.setDescription(text);

	interaction.reply({ embeds: [embed] });

}

function init() { }

function shutdown() { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown };
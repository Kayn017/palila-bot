/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;


/********** INFORMATIONS **********/
const name = "config";
const description = "La commande de configuration du bot";
const explication = "Cette commande permet de configurer différents aspects du bot";
const author = "Kayn";
const options = [];


/********** PERMISSIONS **********/
const intents = [
	Intents.FLAGS.GUILDS
];
const permissions = [];


/********** ACTIONS **********/
async function execute(interaction, options) { }

function init(client) { }

function shutdown(client) { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }
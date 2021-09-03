/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;


/********** INFORMATIONS **********/
const name = "permissions";
const description = "Permet de gérer qui peut configurer le bot";
const explication = "Cette sous-commande permet de définir quels rôles peuvent configurer le bot ou non";
const author = "Kayn";
const options = [];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [];


/********** ACTIONS **********/
async function execute(interaction, options) { }

function init(client) { }

function shutdown(client) { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }
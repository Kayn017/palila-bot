/********** REQUIRE **********/
const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const { orBit } = require("../services/number")

/********** INFORMATIONS **********/
const name = "invit";
const description = "Envoie en MP une invitation pour le bot";
const explication = "Cette commande vous permet de recevoir un lien pour inviter le bot sur le serveur de votre choix !";
const author = "Kayn";
const options = [];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [
	Permissions.FLAGS.SEND_MESSAGES
];


/********** VALUE **********/
let id;
let perms;


/********** ACTIONS **********/
async function execute(interaction, options) {

	const url = `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=${perms}`

	interaction.user.send(`Voici un lien d'invit pour le bot :D\n${url}`);
	interaction.reply({ content: "Check tes DM, bg 👀", ephemeral: true });
}

function init(client) {
	id = client.application.id;
	perms = orBit(client.permissions);
}

function shutdown(client) { }


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }
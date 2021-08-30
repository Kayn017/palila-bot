const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;

const name = "ping";
const description = "Le bot est-il toujours vivant ?";

const intents = [
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES
];
const permissions = [
	Permissions.FLAGS.SEND_MESSAGES
];

async function execute(interaction, args) {
	interaction.reply("Pong");
}

function init(client) { }

function shutdown(client) { }

module.exports = { name, description, intents, permissions, execute, init, shutdown }
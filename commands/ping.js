const Discord = require('discord.js');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;

const name = "ping";
const description = "Le bot est-il toujours vivant ?";
const options = [];

const intents = [];
const permissions = [
	Permissions.FLAGS.SEND_MESSAGES
];

async function execute(interaction, options) {
	interaction.reply({ content: "Pong 🏓", ephemeral: true });
}

function init(client) { }

function shutdown(client) { }

module.exports = { name, description, options, intents, permissions, execute, init, shutdown }
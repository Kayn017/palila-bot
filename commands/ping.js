const name = "ping";

const synthax = `${name}`;

const description = "Ping le bot";

const explication = "Cette commande ping le bot pour voir s'il est là !"

const author = "Kayn"

async function execute(message, args) {
	message.channel.send('Pong.').catch(e => err("Impossible d'envoyer un message sur ce channel.", message, e));
}

module.exports = { name, synthax, description, explication, author, execute };

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
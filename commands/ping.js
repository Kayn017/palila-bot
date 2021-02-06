const name = "ping";

const synthax = `${name}`;

const description = "Ping le bot";

const explication = "Cette commande ping le bot pour voir s'il est là !"

async function execute(message, args) {
	message.channel.send('Pong.');
}

module.exports = { name, synthax, description, explication, execute };
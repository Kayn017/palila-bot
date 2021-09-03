const fs = require('fs');

const name = "quoi_feur";

const description = "Fait la deuxième meilleure vanne du monde";

function init(client) {
	client.on('message', async message => {

		// on ne réagit pas si le message a été envoyé en dm
		if (message.channel.type === 'dm') return;

		// on lit le fichier de conf du serv
		const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

		// si le module n'est pas activé ou si l'author du message est un bot => osef
		if (message.author.bot || !config.quoi_feur) return;


		// Si il n'y a pas de quoi on s'en fou
		if(!message.content.toLowerCase().includes("quoi")) {
			return;
		}

		splitedMessage = message.content.toLowerCase().split(" ");
		console.log(splitedMessage);

		// si la fin du message n'est pas quoi
		if(splitedMessage[splitedMessage.length-1] !== "quoi") {

			//Si l'utilisateur à écrit des lettres la blague marche pas
			if(splitedMessage[splitedMessage.length-1].toLowerCase() !== splitedMessage[splitedMessage.length-1].toUpperCase() ) {
				return
			}
		}

		message.inlineReply('feur');
	});
}

module.exports = { name, description, init };


function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
const { getRandomInt } = require('../services/number');
const fs = require('fs');
const quoi_word = require('../resources/quoi_words.json');

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

		// quoi en fin de phrase suivi par aucuns ou plusieurs caractères spéciaux dans n'importe quel ordre
		const regex = new RegExp('quoi[ .!?"\':;^+=()*-,]*$', 'gi');

		if(regex.test(message.content)){
			quoiFeurise(message);
		}
	});
}

function quoiFeurise(message) {
	message.inlineReply(quoi_word[getRandomInt(quoi_word.length)]);
}

module.exports = { name, description, init };


function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
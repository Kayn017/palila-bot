const { Worker } = require('worker_threads');

const name = "backupchannel"

const synthax = `${name} <arguments>`

const description = "Permet de télécharger sur le serveur du bot toutes les images et videos du channels"

const explication = `Cette commande permet de télécharger toutes les images et vidéos envoyés sur ce channel en plus des vidéos YouTube et Twitter.
Arguments : 
 - no-ytb-link : ne télécharge pas les vidéos YouTube
 - no-twitter-link : ne télécharge pas les vidéos Twitter
 - no-attachement : ne télécharge pas les images et vidéos Discord`

async function execute(message, args) {

	// on execute le worker dans un nouveau thread pour ne pas monopoliser le thread principal
	const worker = new Worker(`${__dirname}/../worker/downloader.js`);

	// une fois le thread prêt, on lui envoie l'id du message de la commande, l'id du channel a backup
	// la guilde dont le channel fait parti et les eventuels arguments
	worker.on('online', () => {

		const param = { msgID: message.id, channelID: message.channel.id, guildID: message.guild.id, arguments: args ? args.join() : null }

		worker.postMessage(param);
	});

	// une fois l'execution du thread terminée, on vérifie si tout s'est bien passé ou non
	worker.on('exit', code => {
		if (code !== 0)
			err(`Erreur : le thread de download a retourné le code ${code}`);
		else
			log(`Le thread s'est correctement arrété`);
	});

}

module.exports = { name, synthax, description, explication, execute };

function log(text) {
	require('../services/log').logStdout(text, name, null);
}

function err(text, msg, e) {
	require('../services/log').logError(text, name, msg ?? null, e ? e.stack : null)
}
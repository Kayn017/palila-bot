const fs = require('fs')

const name = "Vquidab"

const description = "Incrémente le compteur de V. Tout les 5.000 V, envoie un gif d'arnaud qui dab"

function init(client) {

	client.on('message', message => {

		// si le message a été envoyé en mp => osef
		if (message.channel.type === 'dm') return;

		// on importe le fichier de config
		const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

		// si le module est pas activé => osef
		if (!config.Vquidab) return;

		// si le fichier de conf n'existe pas, on le créé
		if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('nbV.json')) {
			fs.writeFileSync(`./guilds/${message.guild.id}/nbV.json`, JSON.stringify({ nbV: 0, nbVLimite: 500 }));
			log(`Création du fichier de configuration pour le nombre de V`, message);
		}

		let { nbV, nbVLimite } = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

		// on compte le nombre de V
		let bidule = message.content.toLowerCase().split("v");
		nbre_de_fois_trouve = bidule.length - 1;

		// on ne peut pas atteindre -1  
		if (nbre_de_fois_trouve < 0)
			nbre_de_fois_trouve = 0;

		// on incrémente
		nbV += nbre_de_fois_trouve;

		// si on a envoyé nbVLimite fois la lettre v en tout, on envoie le gif de arnaud
		if (nbV >= nbVLimite) {
			nbV = nbV % nbVLimite;
			message.channel.send(":v:", { files: ['./resources/Vquidab.gif'] }).catch(e => err("Impossible d'envoyer le message sur le channel.", message, e));
		}

		fs.writeFileSync(`./guilds/${message.guild.id}/nbV.json`, JSON.stringify({ nbV: nbV, nbVLimite: nbVLimite }));

	});
}



module.exports = { name, description, init };

function log(text, msg) {
	require('../services/log').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
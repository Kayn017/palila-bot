/*
 *  Toutes les sous commandes qui gèrent le module seb du bot
 *
 */

const fs = require('fs');
const { fetch } = require('../../services/http');

/** Active ou désactive le module je_suis
 * 
 * @param {*} message 
 * @param {*} args 
 * @param {*} config 
 */
function seb(message, args, config) {
	// Vérification si god
	const gods = JSON.parse(fs.readFileSync('./config/config.json')).discord.gods;
	if (!gods.includes(message.author.id)) {
		return message.channel.send("Vous n'avez pas les droits pour effectuer cette commande").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
	}

	// Chargement de la config de Seb
	const conf = JSON.parse(fs.readFileSync(`./config/seb.json`));

	if (args[1] === "check") {
		// Verification de connection à l'API
		fetch(`${conf.url}/api/profile/me`, { bearer: conf.token, json: true }).then(async (response) => {
			if (response.status === 200) {
				return message.channel.send(`Connecté à Seb™ en tant que ${response?.data?.data?.firstname} ${response?.data?.data?.lastname} (${response?.data?.data?.username})\nPermissions: \`${response?.data?.data?.permissions?.join('`, `')}\`\nURL API GitLab: \`${conf.gitlab_api}\``).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			} else {
				return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}
		}).catch((error) => {
			return message.channel.send(`Problème de connexion à Seb™`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
		});
		return;
	}

	if (!args[1] || (args[1] != 'url' && args[1] != 'token' && args[1] != 'gitlab_api'))
		return message.channel.send("Veuillez préciser si vous voulez définir le token, l'url de Seb ou l'url du project gitlab (API), ou verifier la connectivité à Seb™ (argument attendu : `token`, `url`, `gitlab_api` ou `check`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	if (!args[2])
		return message.channel.send("Veuillez définir une valeur pour `" + args[1] + "`").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	if (args[1] === 'url') {
		if (args[2].endsWith('/')) {
			args[2] = args[2].substring(0, args[2].length - 1);
		}
		conf[args[1]] = args[2];
	} else {
		conf[args[1]] = args[2];
	}

	log(`Seb: Modification de ${args[1]} par ${message.author.tag} (nouvelle valeur: ${args[2]})`, message);

	message.channel.send(`Option ${args[1]} mise à jour !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	if (message.channel.type !== 'dm') {
		try {
			message.delete();
		} catch (e) {
			err('Impossible de supprimer le message!', message, e);
		}
	}

	fs.writeFileSync(`./config/seb.json`, JSON.stringify(conf));
}


module.exports = { seb }

function log(text, msg) {
	require('../../services/log').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
	require('../../services/log').logError(text, "config", msg ?? null, err ? err.stack : null)
}

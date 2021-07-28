/*
 *  Toutes les sous commandes qui gèrent le module lynch du bot
 *
 */

const fs = require('fs')

function lynch(message, config, args) {

	if (!args[1] || (args[1] !== 'enabled' && args[1] !== 'disabled' && args[1] !== 'setChannel'))
		return message.channel.send("Veuillez préciser une action pour ce module (argument attendu : `enabled`, `disabled` ou `setChannel`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	if (args[1] === 'enabled') {
		log(`Activation du module lynch par ${message.author.tag}`, message)
		config.lynch = true;
		message.channel.send(`Module activé !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
	}
	else if (args[1] === 'disabled') {
		log(`Désactivation du module lynch par ${message.author.tag}`, message)
		config.lynch = false;
		message.channel.send(`Module désactivé !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
	}
	else {
		const conf = JSON.parse(fs.readFileSync(`./config/lynch.json`))
		conf.channels[message.guild.id] = message.channel.id
		log(`Définition du channel pour le module lynch par ${message.author.tag}`, message)
		fs.writeFileSync(`./config/lynch.json`, JSON.stringify(conf))
		message.channel.send(`Channel changé ! Les notifications du module seront envoyé sur ce channel.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
	}


}

module.exports = { lynch }

function log(text, msg) {
	require('../../services/log').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
	require('../../services/log').logError(text, "config", msg ?? null, err ? err.stack : null)
}
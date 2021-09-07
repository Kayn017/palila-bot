/*
 *  Toutes les sous commandes qui gèrent le module je_suis du bot
 *
 */


/** Active ou désactive le module je_suis
 * 
 * @param {*} message 
 * @param {*} args 
 * @param {*} config 
 */
function je_suis(message, args, config) {
	if (!args[1] || (args[1] !== 'enabled' && args[1] !== 'disabled'))
		return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

	config.je_suis = args[1] === 'enabled';

	log(`${config.je_suis ? 'Activation' : 'Desactivation'} du module je_suis par ${message.author.tag}`, message);

	message.channel.send(`Module ${config.je_suis ? 'activé' : 'désactivé'} !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

}


module.exports = { je_suis }

function log(text, msg) {
	require('../../services/log').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
	require('../../services/log').logError(text, "config", msg ?? null, err ? err.stack : null)
}
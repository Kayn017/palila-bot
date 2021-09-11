/*
 *  Toutes les sous commandes qui gèrent le module quoi_feur du bot
 *
 */


/** Active ou désactive le module quoi_feur
 * 
 * @param {*} message 
 * @param {*} args 
 * @param {*} config 
 */
function quoi_feur(message, args, config) {
	if (!args[1] || (args[1] !== 'enabled' && args[1] !== 'disabled'))
		return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

		config.quoi_feur = args[1] === 'enabled'

	log(`${config.quoi_feur ? 'Activation' : 'Desactivation'} du module quoi_feur par ${message.author.tag}`, message);

	message.channel.send(`Module ${config.quoi_feur ? 'activé' : 'désactivé'} !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

}


module.exports = { quoi_feur }

function log(text, msg) {
	require('../../services/log').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
	require('../../services/log').logError(text, "config", msg ?? null, err ? err.stack : null)
}
/*
 *  Toutes les sous commandes qui gèrent le module Vquidab du bot
 *
 */



/** Active ou désactive le module Vquidab 
 * 
 * @param {*} message 
 * @param {*} args 
 * @param {*} config 
 */
function Vquidab(message, args, config) {

    if (!args[1] || (args[1] != 'enabled' && args[1] != 'disabled'))
        return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

    if (args[1] == 'enabled')
        config.Vquidab = true;
    else
        config.Vquidab = false;

    log(`${config.Vquidab ? 'Activation' : 'Desactivation'} du module Vquidab par ${message.author.tag}`, message);

    message.channel.send(`Module ${config.Vquidab ? 'activé' : 'désactivé'} !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

}

module.exports = { Vquidab }

function log(text, msg) {
    require('../../utils').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
    require('../../utils').logError(text, "config", msg ?? null, err ? err.stack : null)
}
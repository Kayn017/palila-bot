/*
 *  Toutes les sous commandes qui gèrent le prefixe du bot
 *
 */


/** Change le préfixe du bot pour le serveur donné
 * 
 * @param {*} message 
 * @param {*} config 
 */
function changePrefix(message, config, args) {
    if (!args[1])
        return message.channel.send("Veuillez préciser un préfixe pour le serveur").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

    log(`Changement du préfixe de ${config.prefix} à ${args[1]} par ${message.author.tag}`, message)

    config.prefix = args[1];

    message.channel.send(`Préfixe changé ! Maintenant, le préfixe du serveur est ${config.prefix}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

}

module.exports = { changePrefix }

function log(text, msg) {
    require('../../utils').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
    require('../../utils').logError(text, "config", msg ?? null, err ? err.stack : null)
}
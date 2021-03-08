/** Affiche une erreur dans les logs correctement
 * 
 * @param {*} erreur : message d'erreur
 * @param {*} fileName : nom du module ou de la commande qui a raté
 * @param {*} message : message discord qui a provoqué l'erreur
 * @param {*} stack : stacktrace de l'erreur
 */
function logError(erreur, fileName, message = null, stack = null) {

    let maintenant = new Date();

    let affichage = `[${maintenant.getHours()}:${maintenant.getMinutes()}:${maintenant.getSeconds()}][${fileName}.js]`;

    if (message) {
        if (message.guild)
            affichage += `[${message.guild.name}]`;
        if (message.channel)
            affichage += `[${message.channel.name}]`;
    }

    affichage += ` Erreur : ${erreur}`;

    console.error(affichage);

    if (stack)
        console.error(stack);
}

/** affiche un message dans les logs correctement
 * 
 * @param {*} text : texte a afficher
 * @param {*} fileName : nom du module ou de la commande qui a lancé le log
 */
function logStdout(text, fileName, message = null) {
    let maintenant = new Date();

    let affichage = `[${maintenant.getHours()}:${maintenant.getMinutes()}:${maintenant.getSeconds()}][${fileName}.js]`;

    if (message) {
        if (message.guild)
            affichage += `[${message.guild.name}]`;
        if (message.channel)
            affichage += `[${message.channel.name}]`;
    }

    affichage += ` ${text}`;

    console.log(affichage);
}

module.exports = { logError, logStdout };
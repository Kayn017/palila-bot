/*
 *  Toutes les sous commandes qui gèrent les perms du bot
 *
 */

const Discord = require('discord.js')

/** Ajoute les permissions de controle du bot aux roles pingué dans le message
 * 
 * @param {*} message message de la commande
 * @param {*} config configuration de la guild
 * @param {*} args arguments
 * @returns {Boolean} true si la perm a été accordée, false sinon
 */
function addPermRoles(message, config, args) {

    if (!args[1]) {
        message.channel.send("Veuillez préciser le rôle dont vous souhaitez ajouter les permissions").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        return false;
    }

    if (config.adminRoles == null)
        config.adminRoles = [];

    if (message.mentions.roles) {
        for (let role of message.mentions.roles.values()) {

            if (config.adminRoles.includes(role.id)) continue;

            config.adminRoles.push(role.id);
        }

        message.channel.send("Permission accordée !").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

        return true;
    }
    else {
        message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur accorder la permission").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

        return false;
    }
}

/** Retire les permissions de controle du bot aux roles pingué dans le message
 * 
 * @param {*} message message de la commande
 * @param {*} config configuration de la guild
 * @param {*} args arguments
 * @returns {Boolean} true si la perm a été accordée, false sinon
 */
function removePermRoles(message, config, args) {

    if (!args[1]) {
        message.channel.send("Veuillez préciser le rôle dont vous souhaitez retirer les permissions").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        return false;
    }

    // si aucun role n'a les perms pour configurer le bot, return false
    if (config.adminRoles == null || config.adminRoles == []) {
        message.channel.send("Aucun rôle n'a la permission de configurer le bot. Seuls les personnes avec des droits administrateurs le peuvent.").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        return false;
    }


    if (message.mentions.roles) {
        for (let role of message.mentions.roles.values()) {
            if (!config.adminRoles.includes(role.id)) continue;

            config.adminRoles.splice(config.adminRoles.indexOf(role.id), 1);
        }

        message.channel.send("Permission supprimée !").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

        return true;
    }
    else {
        message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur retirer la permission").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

        return false;
    }
}

/** Envoie un message contenant tout les roles pouvant gérer le bot
 * 
 * @param {*} message message de la commande
 * @param {*} config configuration de la guild
 */
async function seePermRoles(message, config) {
    let desc = "";

    if (config.adminRoles && config.adminRoles.length !== 0)
        for (let idRole of config.adminRoles) {
            const role = await message.guild.roles.fetch(idRole);

            desc += ` - ${role.name}`
        }
    else
        desc = "Aucun role n'a les permissions pour configurer le bot. Seul les admins le peuvent"

    const embed = new Discord.MessageEmbed()
        .setTitle("Listes des rôles pouvant configurer le bot")
        .setColor(0x1e80d6)
        .setDescription(desc);

    return message.channel.send(embed).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
}



module.exports = { addPermRoles, removePermRoles, seePermRoles };

function log(text, msg) {
    require('../../utils').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
    require('../../utils').logError(text, "config", msg ?? null, err ? err.stack : null)
}
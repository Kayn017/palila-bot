const Discord = require('discord.js');

const name = "sondage"

const synthax = `${name} [duree: <duree du sondage de votre choix>] <intitulé du sondage>`

const description = "créer un sondage"

const explication = "Permet de créer un sondage pour une certaine durée."

// une minute par défaut
let duration = 60000;
const yes = '✅'
const no = '❎'

async function execute(message, args) {

    if (!args[0])
        return message.channel.send("Il me faut un intitulé pour ce sondage").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

    if (args.includes("duree:")) {
        let option = args[args.indexOf("duree:") + 1];

        const unite = option.charAt(option.length - 1);
        const number = parseInt(option.substring(0, option.length - 1), 10);

        if (unite === "j")
            duration = number * 24 * 60 * 60 * 1000;
        else if (unite === "h")
            duration = number * 60 * 60 * 1000;
        else if (unite === "m")
            duration = number * 60 * 1000;
        else if (unite === "s")
            duration = number * 1000;
        else
            return message.channel.send("cette unité n'est pas valide !").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

        args.splice(args.indexOf("duree:"), 2);
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(args.join(' '))
        .setColor(0x1e80d6)
        .setDescription(`Fin du sondage : ${new Date(Date.now() + duration + (60 * 60 * 1000)).toUTCString()}`) //décalage horaire
        .setFooter(`Sondage par ${message.author.username}`);

    const sendedMessage = await message.channel.send(embed).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

    let chan = message.channel;
    message.delete().catch(e => err("Impossible de supprimer ce message", message, e));

    await sendedMessage.react(yes);
    await sendedMessage.react(no);

    let collected = await sendedMessage.awaitReactions(reaction => reaction.emoji.name === yes || reaction.emoji.name === no, { time: duration });

    const results = new Discord.MessageEmbed()
        .setTitle(args.join(' '))
        .setColor(0x1e80d6)
        .setDescription(`Résultat du sondage : \n${collected.get(yes) ? collected.get(yes).count - 1 : 0} personnes ont voté ${yes}\n${collected.get(no) ? collected.get(no).count - 1 : 0} personnes ont voté ${no}`)
        .setFooter(`Sondage par ${message.author.username}`);

    chan.send(results).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

}

module.exports = { name, synthax, description, explication, execute };

function err(text, msg, err) {
    require('../utils').logError(text, name, msg ?? null, err ? err.stack : null);
}
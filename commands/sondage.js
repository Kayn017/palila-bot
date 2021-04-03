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

    // s'il n'y a pas d'intitulé, erreur
    if (!args[0])
        return message.channel.send("Il me faut un intitulé pour ce sondage").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

    // si une durée est définie, on la prend
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

    // on prépare le message
    const endDate = new Date(Date.now() + duration);
    const endDateString = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()} à ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;

    const embed = new Discord.MessageEmbed()
        .setTitle(args.join(' '))
        .setColor(0x1e80d6)
        .setDescription(`Fin du sondage : ${endDateString}`) //décalage horaire
        .setFooter(`Sondage par ${message.author.username}`);

    // on l'envoie
    const sendedMessage = await message.channel.send(embed).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

    if (!sendedMessage)
        return;

    let chan = message.channel;

    // on supprime le message de base
    message.delete().catch(e => err("Impossible de supprimer ce message", message, e));

    // on ajoute les reactions au message
    await sendedMessage.react(yes).catch(e => err("Impossible de reagir a ce message", sendedMessage, e));
    await sendedMessage.react(no).catch(e => err("Impossible de reagir a ce message", sendedMessage, e));

    // on récupère les reactions
    const filter = reaction => reaction.emoji.name === yes || reaction.emoji.name === no;

    const collector = sendedMessage.createReactionCollector(filter, { time: duration, dispose: true });

    let nbYes = 0;
    let nbNo = 0;

    collector.on('collect', r => {
        if (r.emoji.name === yes)
            nbYes++;
        else if (r.emoji.name === no)
            nbNo++;
    })

    collector.on('remove', r => {
        if (r.emoji.name === yes)
            nbYes--;
        else if (r.emoji.name === no)
            nbNo--;
    })

    collector.on('end', collected => {

        // on envoie les réponses du sondage
        const results = new Discord.MessageEmbed()
            .setTitle(args.join(' '))
            .setColor(0x1e80d6)
            .setDescription(`Résultat du sondage : \n${nbYes} personnes ont voté ${yes}\n${nbNo} personnes ont voté ${no}`)
            .setFooter(`Sondage par ${message.author.username}`);

        chan.send(results).catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));
    })




}

module.exports = { name, synthax, description, explication, execute };

function err(text, msg, err) {
    require('../utils').logError(text, name, msg ?? null, err ? err.stack : null);
}
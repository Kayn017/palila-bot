const fs = require('fs')
const download = require('../utils').download;

const name = "citation"

const synthax = `${name} [<personne>]`

const description = "Lance une citation très philosophique d'une personne dans la bdd"

const explication = `Cette commande vous renvoie une citation prise hors contexte !
Si le nom d'une personne est spécifié (en 1 mot), cherche une citation de cette personne
Si vous envoyez une citation (en image) avec le nom d'une personne (en 1 mot), l'ajoute a la base de données`

async function execute(message, args) {

    if (!fs.readdirSync("./resources/citations"))
        return err("Le dossier resources de citations n'existe pas", null, null);

    let firstLetter;
    let secondLetter;

    if (message.attachments.array().length === 0) {
        if (args[0]) {
            firstLetter = args[0].charAt(0).toUpperCase();

            if (args[0].charAt(1) && args[0].charAt(1).match(/[a-z]/i))
                secondLetter = args[0].charAt(1).toLowerCase();
            else
                secondLetter = "";

            if (!fs.existsSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`))
                return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
        }
        else {
            do {
                firstLetter = String.fromCharCode(65 + getRandomInt(25));

                if (fs.existsSync(`./resources/citations/${firstLetter}`)) {
                    let folderContent = fs.readdirSync(`./resources/citations/${firstLetter}`);

                    secondLetter = folderContent[getRandomInt(folderContent.length)].charAt(1);
                }

            } while (!fs.existsSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`));
        }

        let formatted;

        if (args[0])
            formatted = args[0].charAt(0).toUpperCase().concat(args[0].charAt(1) ? args[0].substring(1, args[0].length).toLowerCase() : "");

        const quotes = fs.readdirSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`).filter(file => file.startsWith(args[0] ? formatted : firstLetter.concat(secondLetter)));

        if (quotes.length === 0)
            return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

        const fileToSend = quotes[getRandomInt(quotes.length)];

        return message.channel.send({ files: [`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}/${fileToSend}`] }).catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));
    }
    else {
        if (!args[0])
            return message.channel.send("Il me faut l'identité de cette personne (en 1 mot)").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

        if (!fs.existsSync(`./resources/citations/${args[0].charAt(0).toUpperCase()}`)) {
            try {
                fs.mkdirSync(`./resources/citations/${args[0].charAt(0).toUpperCase()}`);
                log(`Création du dossier ./resources/citations/${args[0].charAt(0).toUpperCase()}`);
            }
            catch (e) {
                err(`Impossible de créer le dossier ./resources/citations/${args[0].charAt(0).toUpperCase()}`, null, e);
            }
        }

        let folderName = `./resources/citations/${args[0].charAt(0).toUpperCase()}/${args[0].charAt(0).toUpperCase().concat(args[0].charAt(1).toLowerCase() ?? "")}`

        if (!fs.existsSync(folderName)) {
            try {
                fs.mkdirSync(folderName);
                log(`Création du dossier ${folderName}`);
            }
            catch (e) {
                err(`Impossible de créer le dossier ${folderName}`, null, e);
            }
        }

        for (attachments of message.attachments.array()) {

            const imgFormat = attachments.name.split(".")[attachments.name.split(".").length - 1];
            let imgName = `${args[0].charAt(0).toUpperCase()}${args[0].charAt(1) ? args[0].substring(1, args[0].length).toLowerCase() : ""}.${imgFormat}`;

            if (fs.existsSync(`${folderName}/${imgName}`)) {
                const nbFiles = fs.readdirSync(folderName).filter(file => file.startsWith(`${args[0].charAt(0).toUpperCase()}${args[0].charAt(1) ? args[0].substring(1, args[0].length).toLowerCase() : ""}`)).length;
                imgName = imgName.split(".")[0].concat(`${nbFiles - 1}.`).concat(imgName.split(".")[1]);
            }

            try {
                await download(attachments.url, `${folderName}/${imgName}`);
            }
            catch (e) {
                err("Impossible de télécharger ce fichier", message, e);
            }
        }

        log(`${message.attachments.array().length} ${message.attachments.array().length ? "Citation ajoutée" : "Citations ajoutées"} pour ${args[0]} par ${message.author.username}`);

        return message.channel.send(`${message.attachments.array().length ? "Citation ajoutée" : "Citations ajoutées"} à la base de données !`).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
    }

}

module.exports = { name, synthax, description, explication, execute };

function log(text) {
    require('../utils').logStdout(text, name, null);
}

function err(text, msg, err) {
    require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}

function getRandomInt(max) {
    if (!max)
        throw new Exception("getRandomInt prend un paramètre");

    return Math.floor(Math.random() * Math.floor(max));
}
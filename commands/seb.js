
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs');
const { fetch } = require('../services/http');
const { emojiToNumber, numberToEmoji } = require('../services/number');
const emojis = require('../resources/emojis.json');

const name = "seb";
const synthax = `${name} <commande> [args...]`;

const description = "Interagit avec Seb™";

const explication =
    `Cette commande permet d'intéragir avec Seb™, le système de gestion de l'Amicale. Liste des commandes disponibles:
 - **stocks**: Affiche l'état des stocks
 - **cotiser** <prénom>|<nom>: Rejoindre l'amicale, pour soutenir l'association, pouvoir participer aux réunions et accéder aux features exclusives de Seb™
`;

const author = "Maxime Friess <M4x1me@pm.me>";

const _fetch_categories = async (message, conf) => {
    let response = await fetch(`${conf.url}/api/products_categories`, { bearer: conf.token, json: true });
    if (response.status === 200) {
        return response.data;
    } else {
        return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
};

const _fetch_products = async (message, conf) => {
    let response = await fetch(`${conf.url}/api/products?order_by=name`, { bearer: conf.token, json: true });
    if (response.status === 200) {
        return response.data;
    } else {
        return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
};

const _make_member = async (firstname, lastname, discord_id, conf) => {
    let response = await fetch(`${conf.url}/api/members`, {
        bearer: conf.token, json: true, method: 'POST', data: {
            firstname: firstname,
            lastname: lastname,
            discord_id: discord_id
        }
    });
    return response.data;
};

const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

const cotiser = async (message, args, conf) => {
    let name = args.join(' ');
    name = name.split('|');

    if (name.length !== 2) {
        return message.channel.send(`Merci de spécifier votre prénom et votre nom (,seb cotiser prénom|nom).`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }

    let discord_id = message.author.id;
    let [firstname, lastname] = name;

    let data = await _make_member(uppercaseWords(firstname), lastname.toUpperCase(), "" + discord_id, conf);

    if ('errors' in data) {
        if ('discord_id' in data.errors) {
            return message.channel.send(`Ce compte discord est déjà enregistré en tant que membre dans Seb. Merci de contacter l'amicale en cas de problème.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        } else {
            return message.channel.send(`Une erreur inconnue est survenue.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        }
    } else {
        return message.channel.send(`Bienvenue à l'amicale ${data.data.firstname}!\nAfin d'être considéré comme membre à part entière de l'association, il ne te reste plus qu'à payer la cotisation (${data.contribution} €) auprès d'un membre du bureau de l'amicale.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
}

const stocks = async (message, args, conf) => {
    try {
        let categories = await _fetch_categories(message, conf);
        let products = await _fetch_products(message, conf);


        const attachment = new MessageAttachment('./resources/seb.png', 'seb.png');
        let stocksEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Seb™ : Stocks")
            .attachFiles([attachment])
            .setThumbnail('attachment://seb.png');

        for (let category of categories) {
            let prods = products.filter(p => p.category_id === category.id);
            category.products = prods;

            let string_products = "";
            for (let product of prods) {
                let emoji = emojis.yes;

                if (product.count <= 0) {
                    emoji = emojis.null;
                } else if (product.count <= 10 && product.count <= product.alert_level) {
                    emoji = numberToEmoji(product.count);
                }

                string_products += `${emoji} ${product.name}\n`;
            }

            stocksEmbed = stocksEmbed.addField(category.name, string_products, true);
        }

        message.channel.send(stocksEmbed);
    } catch (e) {
        return message.channel.send(`Problème de connexion à Seb™`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
};

const subcommands = {
    stocks: stocks,
    cotiser: cotiser
};

const execute = async (message, args) => {
    const subcommand = args.shift();
    const conf = JSON.parse(fs.readFileSync(`./config/seb.json`));

    if (subcommand !== undefined && subcommand in subcommands) {
        subcommands[subcommand](message, args, conf);
    } else {
        return message.channel.send("Veuillez spécifier une sous-commande valide").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
};

module.exports = { name, synthax, description, explication, author, execute };
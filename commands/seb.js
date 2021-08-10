
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
    stocks: stocks
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

const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs');
const crypto = require('crypto');
const { fetch } = require('../services/http');
const { emojiToNumber, numberToEmoji } = require('../services/number');
const { cache, cache_age } = require('../services/cache');
const emojis = require('../resources/emojis.json');

const name = "seb";
const synthax = `${name} <commande> [args...]`;

const description = "Interagit avec Seb™";

const explication =
    `Cette commande permet d'intéragir avec Seb™, le système de gestion de l'Amicale. Liste des commandes disponibles:
 - **stocks**: Affiche l'état des stocks
 - **cotiser** <prénom>|<nom>: Rejoindre l'amicale, pour soutenir l'association, pouvoir participer aux réunions et accéder aux features exclusives de Seb™
 - **fact**: Affiche des facts et des stats sur Seb™
`;

const author = "Maxime Friess <M4x1me@pm.me>";

const _fetch_categories = async (message, conf) => {
    let response = await cache('seb.categories', 10, async () => {
        let response = await fetch(`${conf.url}/api/products_categories`, { bearer: conf.token, json: true });
        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    });

    if (response?.status !== 200) {
        return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
    return response.data;
};

const _fetch_products = async (message, conf) => {
    let response = await cache('seb.products', 10, async () => {
        let response = await fetch(`${conf.url}/api/products?order_by=name`, { bearer: conf.token, json: true });
        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    });

    if (response?.status !== 200) {
        return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
    return response.data;
};

const _fetch_stats = async (message, conf) => {
    let response = await cache('seb.stats', 60, async () => {
        let response = await fetch(`${conf.url}/api/stats`, { bearer: conf.token, json: true });
        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    });

    if (response?.status !== 200) {
        return message.channel.send(`Erreur: ${response?.data?.message}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
    return response.data;
};

const _fetch_gitlab = async (message, conf) => {
    let response = await cache('seb.gitlab', 300, async () => {
        let response = await fetch(`${conf.gitlab_api}`, { json: true });
        if (response.status === 200) {
            return response;
        } else {
            return null;
        }
    });

    if (response?.status !== 200) {
        return message.channel.send(`Impossible d'accéder à GitLab.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
    return response.data;
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
            .setTimestamp(cache_age('seb.products'))
            .setThumbnail('attachment://seb.png');

        for (let category of categories.data) {
            let prods = products.data.filter(p => p.category_id === category.id);
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

            if (string_products !== "")
                stocksEmbed = stocksEmbed.addField(category.name, string_products, false);
        }

        message.channel.send(stocksEmbed);
    } catch (e) {
        err("Erreur lors du traitement de la commande ,seb stocks", null, e);
        return message.channel.send(`Problème de connexion à Seb™`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
};

const tember = (message, args, conf) => {

    const attachment = new MessageAttachment('./resources/tember.jpg', 'tember.jpg');
    let stocksEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Seb™ : Tember")
        .setURL('https://www.youtube.com/watch?v=3B4pNK5g8UQ')
        .attachFiles([attachment])
        .setImage('attachment://tember.jpg')
        .setFooter('Do you remember...');
    message.channel.send(stocksEmbed);
}

const _date_diff = (date) => {
    var diff = Math.floor(Date.now() - date);
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);

    let message = years + " années, "
    message += months + " mois et "
    message += days + " jours"

    return message
}

const _random_fact = async (message, conf) => {
    let facts = await cache('seb.facts', 60, async () => {
        let facts = [];

        let stats = await _fetch_stats(message, conf);
        let gitlab = await _fetch_gitlab(message, conf);

        try {
            facts.push(`${stats.sold_coffee_liters}L de cafés ont été vendus depuis la création de Seb™.`);
            facts.push(`Le produit le plus vendu est: ${stats.most_sold_product}.`);
            facts.push(`Un grand fou a dépensé ${new Number(stats.biggest_sale).toFixed(2)}€ d'un coup à l'Amicale.`);
            facts.push("K achète ses gateaux à l'amicale...");
            facts.push(`Seb™ a été créé il y a ${_date_diff(Date.parse(gitlab.created_at))}.`);
            facts.push(`${stats.sold_water_bottles} pigeons ont acheté des bouteilles d'Eau... Alors qu'on a des robinets.`);
            let days_since_restock = Math.floor((Date.now() - Date.parse(stats.latest_restock)) / (24 * 60 * 60 * 1000));
            if (days_since_restock === 0) {
                facts.push("Les courses ont été faites aujourd'hui.");
            } else if (days_since_restock === 1) {
                facts.push("Les courses ont été faites hier.");
            } else {
                facts.push(`Les courses ont été faites il y a ${days_since_restock} jours.`);
            }
            facts.push(`${stats.sold_bounties} bounties ont ont été vendus depuis la création de Seb™ (Merci EW. ^^).`);
            facts.push(`${stats.most_sales} a vendu le plus de produits.`);
            facts.push(`${stats.members} personnes ont généreusement contribué à la survie de l'amicale cette année 💜`);
            facts.push(`L'amicale est ${Math.floor((1 - stats.price_coca / 0.8) * 100)}% moins chère que les distributeurs.`);
            facts.push(`${gitlab.star_count} personnes ont laché une étoile sur le repo de Seb™: <${gitlab.web_url}> 👀`);
        } catch (e) {
            return message.channel.send(`Problème de connexion à Seb™`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
        }
        return facts;
    });

    if (crypto.createHash('sha256').update("" + message.author.id).digest('hex') == '6b24fa4606544621113bf9818522b2326881b6e7e83011aa9277baa926ecc56c')
        facts.push("Pas sur que le ZBot apprécie que vous le trompiez avec moi...");
    return facts[Math.floor(Math.random() * facts.length)];
}

const fact = async (message, args, conf) => {
    try {
        message.channel.send(await _random_fact(message, conf));
    } catch (e) {
        return message.channel.send(`Problème de connexion à Seb™`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
    }
}

const subcommands = {
    stocks: stocks,
    cotiser: cotiser,
    tember: tember,
    fact: fact
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

function err(text, msg, err) {
    require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}

module.exports = { name, synthax, description, explication, author, execute };
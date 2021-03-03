const Discord = require('discord.js');
const fs = require('fs');

const name = "presence"

const description = "La rich presence du bot"

function init(client) {

    const configFilePresence = `${__dirname}/../config/presence.json`;

    let configPresence = JSON.parse(fs.readFileSync(configFilePresence));

    fs.watchFile(configFilePresence, (curr, prev) => {
        configPresence = JSON.parse(fs.readFileSync(configFilePresence));
        client.user.setPresence(configPresence);
    })


    client.on('ready', () => {
        client.user.setPresence(configPresence);
    });

}


module.exports = { name, description, init };
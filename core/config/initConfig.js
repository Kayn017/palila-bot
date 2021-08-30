const fs = require('fs');
const { debug } = require("../../services/log");
const { waitForUser } = require('../../services/stdio');

function initConfig() {

	const config = JSON.parse(fs.readFileSync(`./config/config.json`));

	if (config.discord.token === null) {

		console.log(`Aucun token discord renseigné. Entrez un token : `);
		const answer = waitForUser();

		config.discord.token = answer;
		debug(`Token updated`, "initConfig");
	}

	if (config.discord.gods.length === 0) {
		console.log(`Aucun utilisateur god spécifié. Entrez un ID d'utilisateur : `);
		const answer = waitForUser();

		config.discord.gods = [answer];
		debug(`God added`, "initConfig");
	}

	if (config.discord.devGuild === null) {
		console.log(`Aucun guild de développement spécifié. Entrez un ID de guild : `);
		const answer = waitForUser();

		config.discord.devGuild = answer;
		debug(`devGuild added`, "initConfig");
	}

	fs.writeFileSync(`./config/config.json`, JSON.stringify(config));
}

module.exports = { initConfig }
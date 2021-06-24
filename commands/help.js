const Discord = require('discord.js')
const fs = require('fs')

const name = 'help';

const synthax = `${name} <commande>`

const description = "L'aide de ce bot"

const explication = "Cette commande affiche l'aide du bot et les explications des commandes du bot"

const author = "Kayn"

async function execute(message, args) {

	let prefix;

	if (message.channel.type === 'dm')
		prefix = JSON.parse(fs.readFileSync(`./config/config.json`)).prefix
	else
		prefix = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`)).prefix;

	let desc = "";
	let title = "";
	let footer = "";

	if (!args[0]) {
		title = "Les commandes du bot"
		for (const cmd of message.client.commands.array()) {
			desc += "**" + cmd.name + "** : " + cmd.description + "\n\n";
		}
	}
	else {
		const cmd = message.client.commands.get(args[0]);

		if (!cmd)
			title = "Commande inconnue...";
		else {
			title = cmd.name;
			desc += cmd.explication + "\n";
			desc += "**Syntaxe** : " + prefix + cmd.synthax + "\n";
			footer = cmd.author ? `Commande créée par ${cmd.author}` : `Auteur(e) anonyme...`
		}
	}

	const embed = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(0x1e80d6)
		.setDescription(desc)
		.setFooter(footer);


	message.channel.send(embed).catch(e => err("Impossible d'envoyer un message sur ce channel.", message, e));
}

module.exports = { name, synthax, description, explication, author, execute };

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
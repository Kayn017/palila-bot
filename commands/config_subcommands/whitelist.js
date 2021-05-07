/*
 *  Toutes les sous commandes qui gèrent le prefixe du bot
 */

const fs = require('fs')
const Discord = require('discord.js')

function whitelist(message, args, config) {

	if (!config.whitelist)
		config.whitelist = false;

	if (!args[1])
		return message.channel.send("Veuillez préciser une action. Attendu : `enabled`,`disabled`, `delete`, `set` ou `show`").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));


	if (args[1] === 'set')
		setOnWhitelist(message);

	else if (args[1] === 'delete')
		deleteFromWhitelist(message);

	else if (args[1] === 'show')
		show(message)

	else if (args[1] === 'enabled')
		activate(message, config)

	else if (args[1] === 'disabled')
		desactivate(message, config)

	else
		return message.channel.send("Veuillez préciser une action valide. Attendu : `enabled`,`disabled`, `delete`, `set` ou `show`").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

}


module.exports = { whitelist }


/** Met le channel dans la whitelist
 * 
 * @param {*} message 
 */
function setOnWhitelist(message) {
	let whitelist;

	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
		whitelist = { channels: [] };
	else
		whitelist = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/whitelist.json`));

	whitelist.channels.push(message.channel.id);

	fs.writeFileSync(`./guilds/${message.guild.id}/whitelist.json`, JSON.stringify(whitelist));

	message.channel.send(`Channel ajouté à la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
}

/** Supprime le channel de la whitelist
 * 
 * @param {*} message 
 */
function deleteFromWhitelist(message) {

	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	let whitelist = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/whitelist.json`));

	if (!whitelist.channels[0])
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	if (!whitelist.channels.includes(message.channel.id))
		return message.channel.send(`Ce channel n'est pas sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	whitelist.channels.splice(whitelist.channels.indexOf(message.channel.id), 1);

	fs.writeFileSync(`./guilds/${message.guild.id}/whitelist.json`, JSON.stringify(whitelist));

	message.channel.send(`Channel enlevé de la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
}

/** Envoie un message avec toutes les channels dans la whitelist
 * 
 * @param {*} message 
 */
async function show(message) {
	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

	let whitelist = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/whitelist.json`));

	if (!whitelist.channels[0])
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	const title = `Whitelist du serveur ${message.guild.name}`

	let desc = "";

	for (const id of whitelist.channels) {
		let chan = await message.client.channels.fetch(id);
		desc += ` - ${chan.name}\n`
	}

	const embed = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(0x1e80d6)
		.setDescription(desc);

	message.channel.send(embed).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
}

/** Active la whitelist
 * 
 * @param {*} message 
 * @param {*} config 
 */
function activate(message, config) {
	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	let whitelist = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/whitelist.json`));

	if (!whitelist.channels[0])
		return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

	if (config.whitelist)
		return message.channel.send(`Whitelist déjà activée`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	config.whitelist = true;

	log(`Activation de la whitelist par ${message.author.tag}`, message);
	message.channel.send(`Activation de la whitelist !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
}

/** Desactive la whitelist
 * 
 * @param {*} message 
 * @param {*} config 
 * @returns 
 */
function desactivate(message, config) {
	if (!config.whitelist)
		return message.channel.send(`Whitelist déjà désactivée`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	config.whitelist = false;

	log(`Désactivation de la whitelist par ${message.author.tag}`, message);

	message.channel.send(`Désactivation de la whitelist !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

}

function log(text, msg) {
	require('../../services/log').logStdout(text, "config", msg ?? null);
}

function err(text, msg, err) {
	require('../../services/log').logError(text, "config", msg ?? null, err ? err.stack : null)
}
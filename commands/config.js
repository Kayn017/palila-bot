const Discord = require('discord.js');

const fs = require('fs');

const name = "config";

const synthax = `${name} <options> <argument(s)>`

const description = "change la configuration du bot pour ce serveur"

const explication =
	`Cette commande sert a configurer le bot sur ce serveur. Par défaut, seuls les personnes avec des permissions administrateurs peuvent utiliser cette commande.
Options disponibles : 
	- addPermRoles : donne la permission aux gens possédant le rôle passé en argument de configurer le bot
	- removePermRoles : retire la permissions
	- seePermRoles : affiche la liste des rôles ayant les permissions de modifier la configuration du bot
	- changePrefix : change le préfixe pour activer le bot par le(s) caractère(s) passé en arguments
	- whitelist : gère les channels sur lesquelles le bot prend en compte les commandes
`

async function execute(message, args) {

	const config = require(`../guilds/${message.guild.id}/config.json`);

	// on vérifie les permissions
	if (!message.member.hasPermission('ADMINISTRATOR') && message.author.id != '371285073191895072') {

		let hasPerm = false;

		for (let role of message.member.roles.cache.values()) {
			if (!config.adminRoles)
				break;

			if (config.adminRoles.includes(role.id)) {
				hasPerm = true;
				break;
			}
		}

		if (!hasPerm)
			return message.channel.send("Vous n'avez pas les droits pour effectuer cette commande").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
	}

	// on vérifie s'il y a des arguments
	if (!args[0])
		return message.channel.send(`Syntaxe incorret. \`${config.prefix}help ${name}\` pour plus d'informations.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));


	switch (args[0]) {
		case 'addPermRoles':
			if (!args[1])
				return message.channel.send("Veuillez préciser le rôle dont vous souhaitez ajouter les permissions").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

			if (config.adminRoles == null)
				config.adminRoles = [];

			if (message.mentions.roles) {
				for (let role of message.mentions.roles.values()) {

					if (config.adminRoles.includes(role.id)) continue;

					config.adminRoles.push(role.id);
					log(`Ajout des perms au rôle ${role.name} par ${message.author.tag}`, message);
				}

				message.channel.send("Permission accordée !").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}
			else
				return message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur accorder la permission").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			break;

		case 'removePermRoles':
			if (!args[1])
				return message.channel.send("Veuillez préciser le rôle dont vous souhaitez retirer les permissions").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			if (config.adminRoles == null || config.adminRoles == [])
				return message.channel.send("Aucun rôle n'a la permission de configurer le bot. Seuls les personnes avec des droits administrateurs le peuvent.").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			if (message.mentions.roles) {
				for (let role of message.mentions.roles.values()) {
					if (!config.adminRoles.includes(role.id)) continue;

					config.adminRoles.splice(config.adminRoles.indexOf(role.id), 1);
					log(`Retrait des perms au rôle ${role.name} par ${message.author.tag}`, message)
				}

				message.channel.send("Permission supprimée !").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}
			else
				return message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur retirer la permission").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			break;

		case 'seePermRoles':

			let desc = "";

			if (config.adminRoles)
				for (let idRole of config.adminRoles) {
					const role = await message.guild.roles.fetch(idRole);

					desc += ` - ${role.name}`
				}
			else
				desc = "Aucun role n'a les permissions pour configurer le bot. Seul les admins le peuvent"

			const embed = new Discord.MessageEmbed()
				.setTitle("Listes des rôles pouvant configurer le bot")
				.setColor(0x1e80d6)
				.setDescription(desc);

			return message.channel.send(embed).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

		case 'changePrefix':

			if (!args[1])
				return message.channel.send("Veuillez préciser un préfixe pour le serveur").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			log(`Changement du préfixe de ${config.prefix} à ${args[1]} par ${message.author.tag}`, message)

			config.prefix = args[1];

			message.channel.send(`Préfixe changé ! Maintenant, le préfixe du serveur est ${config.prefix}`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

			break;

		case 'je_suis':

			if (!args[1] || (args[1] != 'enabled' && args[1] != 'disabled'))
				return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

			if (args[1] == 'enabled')
				config.je_suis = true;
			else
				config.je_suis = false;

			log(`${config.je_suis ? 'Activation' : 'Desactivation'} du module je_suis par ${message.author.tag}`, message);

			message.channel.send(`Module ${config.je_suis ? 'activé' : 'désactivé'} !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			break;

		case 'Vquidab':
			if (!args[1] || (args[1] != 'enabled' && args[1] != 'disabled'))
				return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			if (args[1] == 'enabled')
				config.Vquidab = true;
			else
				config.Vquidab = false;

			log(`${config.Vquidab ? 'Activation' : 'Desactivation'} du module Vquidab par ${message.author.tag}`, message);

			message.channel.send(`Module ${config.Vquidab ? 'activé' : 'désactivé'} !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			break;

		case 'whitelist':
			if (!config.whitelist)
				config.whitelist = false;

			if (!args[1])
				return message.channel.send("Veuillez préciser une action. Attendu : `enabled`,`disabled`, `delete`, `set` ou `show`").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			if (args[1] === 'set') {

				let whitelist;

				if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
					whitelist = { channels: [] };
				else
					whitelist = require(`../guilds/${message.guild.id}/whitelist.json`);

				whitelist.channels.push(message.channel.id);

				fs.writeFileSync(`./guilds/${message.guild.id}/whitelist.json`, JSON.stringify(whitelist));

				delete require.cache[require.resolve(`../guilds/${message.guild.id}/whitelist.json`)];

				message.channel.send(`Channel ajouté à la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

			}
			else if (args[1] === 'delete') {
				if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
					return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

				let whitelist = require(`../guilds/${message.guild.id}/whitelist.json`);

				if (!whitelist.channels[0])
					return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

				if (!whitelist.channels.includes(message.channel.id))
					return message.channel.send(`Ce channel n'est pas sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

				whitelist.channels.splice(whitelist.channels.indexOf(message.channel.id), 1);

				delete require.cache[require.resolve(`../guilds/${message.guild.id}/whitelist.json`)];

				fs.writeFileSync(`./guilds/${message.guild.id}/whitelist.json`, JSON.stringify(whitelist));

				message.channel.send(`Channel enlevé de la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

			}
			else if (args[1] === 'show') {
				if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
					return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

				let whitelist = require(`../guilds/${message.guild.id}/whitelist.json`);

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

				delete require.cache[require.resolve(`../guilds/${message.guild.id}/whitelist.json`)];

			}
			else if (args[1] === 'enabled') {

				if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('whitelist.json'))
					return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

				let whitelist = require(`../guilds/${message.guild.id}/whitelist.json`);

				if (!whitelist.channels[0])
					return message.channel.send(`Aucun channel n'est sur la whitelist`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

				if (config.whitelist)
					return message.channel.send(`Whitelist déjà activée`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

				config.whitelist = true;

				log(`Activation de la whitelist par ${message.author.tag}`, message);
				message.channel.send(`Activation de la whitelist !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}
			else if (args[1] === 'disabled') {

				if (!config.whitelist)
					return message.channel.send(`Whitelist déjà désactivée`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

				config.whitelist = false;
				log(`Désactivation de la whitelist par ${message.author.tag}`, message);
				message.channel.send(`Désactivation de la whitelist !`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}
			else {
				return message.channel.send("Veuillez préciser une action valide. Attendu : `enabled`,`disabled`, `delete`, `set` ou `show`").catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));
			}

			break;
		default:
			return message.channel.send(`Cette option m'est inconnue... \`${config.prefix}help ${name}\` pour plus d'informations.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	}


	fs.writeFileSync(`./guilds/${message.guild.id}/config.json`, JSON.stringify(config));


	delete require.cache[require.resolve(`../guilds/${message.guild.id}/config.json`)];

}

module.exports = { name, synthax, description, explication, execute };

function log(text, msg) {
	require('../utils').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}
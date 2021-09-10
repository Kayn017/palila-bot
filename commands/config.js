const Discord = require('discord.js');

const fs = require('fs');

const perms = require('./config_subcommands/perms');
const prefixConfig = require('./config_subcommands/prefix');
const je_suisConfig = require('./config_subcommands/je_suis');
const quoi_feurConfig = require('./config_subcommands/quoi_feur');
const VquidabConfig = require('./config_subcommands/Vquidab');
const whitelistConfig = require('./config_subcommands/whitelist');
const lynch = require('./config_subcommands/lynch');
const seb = require('./config_subcommands/seb');

const name = "config";

const synthax = `${name} <options> <argument(s)>`

const description = "change la configuration du bot pour ce serveur"

const explication =
	`Cette commande sert a configurer le bot sur ce serveur. Par défaut, seuls les personnes avec des permissions administrateurs peuvent utiliser cette commande.
Options disponibles : 
	- **addPermRoles** : donne la permission aux gens possédant le rôle passé en argument de configurer le bot
	- **removePermRoles** : retire la permissions
	- **seePermRoles** : affiche la liste des rôles ayant les permissions de modifier la configuration du bot
	- **changePrefix** : change le préfixe pour activer le bot par le(s) caractère(s) passé en arguments
	- **whitelist** : gère les channels sur lesquelles le bot prend en compte les commandes
	- **lynch** : configure le module lynch
	- **seb** : configure la commande Seb™
`

const author = "Kayn";

async function execute(message, args) {

	const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));
	const gods = JSON.parse(fs.readFileSync('./config/config.json')).discord.gods

	// on vérifie les permissions
	if (!message.member.hasPermission('ADMINISTRATOR') && !gods.includes(message.author.id)) {

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
			if (perms.addPermRoles(message, config, args))
				log(`Ajout de permissions par ${message.author.tag}`, message);
			break;

		case 'removePermRoles':
			if (perms.removePermRoles(message, config, args))
				log(`Retrait de permissions par ${message.author.tag}`, message);
			break;

		case 'seePermRoles':
			perms.seePermRoles(message, config);
			break;

		case 'changePrefix':
			prefixConfig.changePrefix(message, args, config);
			break;

		case 'je_suis':
			je_suisConfig.je_suis(message, args, config);
			break;

		case 'quoi_feur':
			quoi_feurConfig.quoi_feur(message, args, config);
			break;

		case 'Vquidab':
			VquidabConfig.Vquidab(message, args, config);
			break;

		case 'whitelist':
			whitelistConfig.whitelist(message, args, config);
			break;

		case 'lynch':
			lynch.lynch(message, args, config)
      break;
      
    case 'seb':
			seb.seb(message, args, config)
			break;

		default:
			return message.channel.send(`Cette option m'est inconnue... \`${config.prefix}help ${name}\` pour plus d'informations.`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));

	}


	fs.writeFileSync(`./guilds/${message.guild.id}/config.json`, JSON.stringify(config));

}

module.exports = { name, synthax, description, explication, author, execute };

function log(text, msg) {
	require('../services/log').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
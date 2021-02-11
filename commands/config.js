const Discord = require('discord.js')
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
			return message.channel.send("Vous n'avez pas les droits pour effectuer cette commande");
	}

	// on vérifie s'il y a des arguments
	if (!args[0])
		return message.channel.send(`Syntaxe incorret. \`${config.prefix}help ${name}\` pour plus d'informations.`);


	switch (args[0]) {
		case 'addPermRoles':
			if (!args[1])
				return message.channel.send("Veuillez préciser le rôle dont vous souhaitez ajouter les permissions");

			if (config.adminRoles == null)
				config.adminRoles = [];

			if (message.mentions.roles) {
				for (let role of message.mentions.roles.values()) {

					if (config.adminRoles.includes(role.id)) continue;

					config.adminRoles.push(role.id);
					console.log(`[${name}.js] Ajout des perms au rôle ${role.name} sur le serveur "${message.guild.name}" par ${message.author.tag}`)
				}

				message.channel.send("Permission accordée !")
			}
			else
				return message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur accorder la permission");
			break;

		case 'removePermRoles':
			if (!args[1])
				return message.channel.send("Veuillez préciser le rôle dont vous souhaitez retirer les permissions");

			if (config.adminRoles == null || config.adminRoles == [])
				return message.channel.send("Aucun rôle n'a la permission de configurer le bot. Seuls les personnes avec des droits administrateurs le peuvent.");

			if (message.mentions.roles) {
				for (let role of message.mentions.roles.values()) {
					if (!config.adminRoles.includes(role.id)) continue;

					config.adminRoles.splice(config.adminRoles.indexOf(role.id), 1);
					console.log(`[${name}.js] Retrait des perms au rôle ${role.name} sur le serveur "${message.guild.name}" par ${message.author.tag}`)
				}

				message.channel.send("Permission supprimée !")
			}
			else
				return message.channel.send("Il faut pinguer le ou les rôle(s) en question pour que je puisse leur retirer la permission");
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

			return message.channel.send(embed);

		case 'changePrefix':

			if (!args[1])
				return message.channel.send("Veuillez préciser un préfixe pour le serveur");

			console.log(`[${name}.js] Changement du préfixe de ${config.prefix} à ${args[1]} sur le serveur "${message.guild.name}" par ${message.author.tag}`)

			config.prefix = args[1];

			message.channel.send(`Préfixe changé ! Maintenant, le préfixe du serveur est ${config.prefix}`);

			break;

		case 'je_suis':

			if (!args[1] || (args[1] != 'enabled' && args[1] != 'disabled'))
				return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)");

			if (args[1] == 'enabled')
				config.je_suis = true;
			else
				config.je_suis = false;

			console.log(`[${name}.js] ${config.je_suis ? 'Activation' : 'Desactivation'} du module je_suis sur le serveur "${message.guild.name}" par ${message.author.tag}`);

			message.channel.send(`Module ${config.je_suis ? 'activé' : 'désactivé'} !`);

			break;

		case 'Vquidab':
			if (!args[1] || (args[1] != 'enabled' && args[1] != 'disabled'))
				return message.channel.send("Veuillez préciser si vous activez ou non ce module (argument attendu : `enabled` ou `disabled`)");

			if (args[1] == 'enabled')
				config.Vquidab = true;
			else
				config.Vquidab = false;

			console.log(`[${name}.js] ${config.Vquidab ? 'Activation' : 'Desactivation'} du module Vquidab sur le serveur "${message.guild.name}" par ${message.author.tag}`);

			message.channel.send(`Module ${config.Vquidab ? 'activé' : 'désactivé'} !`);

			break;

		default:
			return message.channel.send(`Cette option m'est inconnue... \`${config.prefix}help ${name}\` pour plus d'informations.`);

	}


	fs.writeFileSync(`./guilds/${message.guild.id}/config.json`, JSON.stringify(config));

}

module.exports = { name, synthax, description, explication, execute };
const Discord = require('discord.js');
const fs = require('fs');

const name = "partiels";

const synthax = `${name} <action> <argument(s)>`;

const description = "Met en commun plusieurs channels pour les partiels";

const explication = `Cette commande permet de mettre en commun les messages de divers channels sur divers serveurs pour l'entraide \"avant\" les partiels
Actions disponibles :
	- setChannel : inscrit ce channel dans un canal et le désincrit de l'ancien canal s'il existe
	- activateChannel : connecte ce channel au canal ou il est inscrit
	- desactivateChannel : déconnecte ce channel du canal ou il est inscrit
	- createCanal : créé un nouveau canal
	- seeChannelCanal : affiche a quel canal est connecté ce channel
	- deleteChannel : déconnecte ce channel de tout canal
`;


// TODO 
// - faire les vérifs des fichiers de conf systématiquement
// - faire la commande destroyCanal

async function execute(message, args) {
	const config = require(`../guilds/${message.guild.id}/config.json`);

	// on vérifie s'il y a des arguments
	if (!args[0])
		return message.channel.send(`Syntaxe incorret. \`${config.prefix}help ${name}\` pour plus d'informations.`);

	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('partiels_config.json')) {
		fs.writeFileSync(`./guilds/${message.guild.id}/partiels_config.json`, JSON.stringify({}));
		console.log(`[${name}.js] Création du fichier de configuration pour les partiels pour le serveur ${message.guild.name}`);
	}

	let partielGlobal = require('../config/partiels_config.json');
	let partielGuild = require(`../guilds/${message.guild.id}/partiels_config.json`);

	switch (args[0]) {
		case 'setChannel':

			if (!args[1] || !partielGlobal[args[1]]) {
				let listeCanal = "";

				for (let canal in partielGlobal) {
					listeCanal += ` - ${canal}\n`;
				}

				await message.channel.send("Veuillez spécifier un canal pour ce channel");

				const embed = new Discord.MessageEmbed()
					.setTitle("Liste des canaux disponibles")
					.setColor(0x1e80d6)
					.setDescription(listeCanal);

				return message.channel.send(embed);
			}

			if (partielGuild[message.channel.name]) {
				let old_canal = partielGuild[message.channel.name].canal;
				partielGlobal[old_canal].splice(partielGlobal[old_canal].indexOf(message.channel.id), 1);
			}

			partielGuild[message.channel.name] = {
				activated: false,
				canal: args[1]
			}

			partielGlobal[args[1]].push(message.channel.id);

			console.log(`[${name}.js] Ajout du channel ${message.channel.name} sur le serveur ${message.guild.name} au canal ${args[1]} par ${message.author.tag}`);

			message.channel.send("Ce channel fait désormais parti du canal " + args[1])

			break;
		case 'activateChannel':
			message.channel.send("Vous êtes connecté au canal " + partielGuild[message.channel.name].canal)
			partielGuild[message.channel.name].activated = true;
			break;
		case 'desactivateChannel':
			message.channel.send("Vous êtes déconnecté au canal " + partielGuild[message.channel.name].canal)
			partielGuild[message.channel.name].activated = false;
			break;
		case 'createCanal':
			if (!args[1]) {
				return message.channel.send("Veuillez préciser le nom du canal en argument");
			}

			partielGlobal[args[1]] = [];

			console.log(`[${name}.js] Creation du canal ${args[1]} par ${message.author.tag}`);

			message.channel.send("Canal " + args[1] + " créé !");

			break;
		case 'seeChannelCanal':
			if (!partielGuild[message.channel.name].canal)
				return message.channel.send("Ce channel n'est inscrit dans aucun canal");

			return message.channel.send(`Ce channel est inscrit sur le canal ${partielGuild[message.channel.name].canal}`);
		case 'deleteChannel':
			if (!partielGuild[message.channel.name].canal)
				return message.channel.send("Ce channel n'est inscrit dans aucun canal");

			partielGlobal[partielGuild[message.channel.name].canal].splice(partielGlobal[partielGuild[message.channel.name].canal].indexOf(message.channel.id), 1);
			delete partielGuild[message.channel.name];
			console.log(`[${name}.js] Suppression du channel ${message.channel.name} sur le serveur ${message.guild.name} des fichiers de configuration par ${message.author.tag}`);
			message.channel.send("Channel déconnecté");
			break;
		default:
			return message.channel.send("Je ne connais pas cette opération...");

	}

	fs.writeFileSync(`./config/partiels_config.json`, JSON.stringify(partielGlobal));
	fs.writeFileSync(`./guilds/${message.guild.id}/partiels_config.json`, JSON.stringify(partielGuild));

}

module.exports = { name, synthax, description, explication, execute };
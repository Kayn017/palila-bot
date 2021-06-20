const Discord = require('discord.js');
const fs = require('fs');

const name = "canals";

const synthax = `${name} <action> <argument(s)>`;

const description = "Met en commun plusieurs channels dans des canaux";

const explication = `Cette commande permet de mettre en commun les messages de divers channels sur divers serveurs autour d'une meme thématique par exemple
Actions disponibles :
	- setCanal : inscrit ce channel dans un canal et le désincrit de l'ancien canal s'il existe
	- activateChannel : connecte ce channel au canal ou il est inscrit
	- desactivateChannel : déconnecte ce channel du canal ou il est inscrit
	- createCanal : créé un nouveau canal
	- seeChannelCanal : affiche a quel canal est connecté ce channel
	- disconnectChannel : déconnecte ce channel de tout canal
	- listCanal : renvoie la liste des canaux existants
`;

const author = "Kayn"

async function execute(message, args) {

	//on récupère le fichier de configuration de la guilde
	const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

	// on vérifie s'il y a des arguments
	if (!args[0])
		return message.channel.send(`Syntaxe incorret. \`${config.prefix}help ${name}\` pour plus d'informations.`).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	// si le fichier de configuration du module canal n'existe pas, on le créé
	if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('canals_config.json')) {
		fs.writeFileSync(`./guilds/${message.guild.id}/canals_config.json`, JSON.stringify({}));
		log(`Création du fichier de configuration pour les canaux`, message);
	}

	// on récupère les configurations
	let configGlobal = JSON.parse(fs.readFileSync('./config/canals_config.json'));
	let configGuild = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/canals_config.json`));

	//on fait un action
	switch (args[0]) {
		case 'setCanal':
			setCanal(message, args, configGuild, configGlobal);
			break;
		case 'activateChannel':
			activateChannel(message, configGuild);
			break;
		case 'desactivateChannel':
			desactivateChannel(message, configGuild);
			break;
		case 'createCanal':
			createCanal(message, args, configGlobal);
			break;
		case 'seeChannelCanal':
			showChannelCanal(message, configGuild);
			break;
		case 'disconnectChannel':
			disconnectChannel(message, configGlobal, configGuild);
			break;
		case 'listCanal':
			listCanal(message, configGlobal);
			break;
		default:
			return message.channel.send("Je ne connais pas cette opération...").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	}

	// on enregistre les resultats
	fs.writeFileSync(`./config/canals_config.json`, JSON.stringify(configGlobal));
	fs.writeFileSync(`./guilds/${message.guild.id}/canals_config.json`, JSON.stringify(configGuild));

}

module.exports = { name, synthax, description, explication, author, execute };

function log(text, msg) {
	require('../services/log').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}

/** Associe le channel courant a un canal
 * 
 * @param {*} message Message avec la commande
 * @param {*} args Arguments de la commande
 * @param {*} configGuild fichier de config de la guilde
 * @param {*} configGlobal fichier de config global
 */
function setCanal(message, args, configGuild, configGlobal) {

	// s'il n'y a pas de nom de canals ou un nom invalide, on renvoie la liste des canaux
	if (!args[1] || !configGlobal[args[1]]) {
		return listCanal(message, configGlobal);
	}

	// si le channel est deja sur un canal, on l'enlève
	if (configGuild[message.channel.name]) {

		let old_canal = configGuild[message.channel.name].canal;

		// on supprime le channel du fichier de configuration global
		configGlobal[old_canal].splice(configGlobal[old_canal].indexOf(message.channel.id), 1);
	}

	const newCanal = args[1];

	configGuild[message.channel.name] = {
		activated: false,
		canal: newCanal
	}

	configGlobal[newCanal].push(message.channel.id);

	log(`Ajout du channel au canal ${newCanal} par ${message.author.tag}`, message);

	message.channel.send("Ce channel fait désormais parti du canal " + newCanal).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
}

/** Connecte le channel au canal
 * 
 * @param {*} message 
 * @param {*} configGuild 
 */
function activateChannel(message, configGuild) {

	const nomCanal = configGuild[message.channel.name].canal

	message.channel.send("Vous êtes connecté au canal " + nomCanal).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	configGuild[message.channel.name].activated = true;
}

/** Déconnecte le channel du canal
 * 
 * @param {*} message 
 * @param {*} configGuild 
 */
function desactivateChannel(message, configGuild) {
	const nomCanal = configGuild[message.channel.name].canal;

	message.channel.send("Vous êtes déconnecté au canal " + nomCanal).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	configGuild[message.channel.name].activated = false;
}

/** Créer un nouveal canal
 * 
 * @param {*} message 
 * @param {*} args 
 * @param {*} configGlobal 
 */
function createCanal(message, args, configGlobal) {
	if (!args[1]) {
		return message.channel.send("Veuillez préciser le nom du canal en argument").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
	}

	const canalName = args[1];

	configGlobal[canalName] = [];

	log(`Creation du canal ${canalName} par ${message.author.tag}`, message);

	message.channel.send("Canal " + canalName + " créé !").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

}


/** Envoie un message avec le canal sur lequel est inscrit le channel
 * 
 * @param {*} message 
 * @param {*} configGuild 
 */
function showChannelCanal(message, configGuild) {

	if (!configGuild[message.channel.name])
		return message.channel.send("Ce channel n'est inscrit dans aucun canal").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	return message.channel.send(`Ce channel est inscrit sur le canal ${configGuild[message.channel.name].canal}`).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
}

/** Déconnecte le channel du canal ou il etait inscrit
 * 
 * @param {*} message 
 * @param {*} configGlobal 
 * @param {*} configGuild 
 */
function disconnectChannel(message, configGlobal, configGuild) {

	if (!configGuild[message.channel.name])
		return message.channel.send("Ce channel n'est inscrit dans aucun canal").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));

	//on récupère le canal sur lequel était connecté le channel
	const canalChannel = configGuild[message.channel.name].canal;

	//on supprime le channel du canal dans le fichier de configuration global
	configGlobal[canalChannel].splice(configGlobal[canalChannel].indexOf(message.channel.id), 1);

	//on supprime le channel du fichier de configuration de la guild
	delete configGuild[message.channel.name];

	log(`Suppression du channel des fichiers de configuration par ${message.author.tag}`, message);

	message.channel.send("Channel déconnecté").catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
}

/** Envoie la liste des canaux
 * 
 * @param {*} message 
 * @param {*} configGlobal 
 */
function listCanal(message, configGlobal) {

	let listeCanal = "";

	for (let canal in configGlobal) {
		listeCanal += ` - ${canal}\n`;
	}

	const embed = new Discord.MessageEmbed()
		.setTitle("Liste des canaux disponibles")
		.setColor(0x1e80d6)
		.setDescription(listeCanal);

	return message.channel.send(embed).catch(error => err("Impossible d'envoyer un message sur ce channel.", message, error));
}
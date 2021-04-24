const fs = require('fs')
const { download } = require('../services/http');
const { getRandomInt } = require('../services/number')
const string = require('../services/string')
const path = require('path')

const config = require('../config/config.json')

const name = "citation"

const synthax = `${name} [<personne>]`

const description = "Lance une citation très philosophique d'une personne dans les stocks"

const explication = `Cette commande vous renvoie une citation prise hors contexte !
Si le nom d'une personne est spécifié (en 1 mot), cherche une citation de cette personne
Si vous envoyez une citation (en image) avec le nom d'une personne (en 1 mot), l'ajoute a la base de données`

async function execute(message, args) {

	if (!fs.readdirSync("./resources/citations"))
		return err("Le dossier resources de citations n'existe pas", null, null);

	if (message.attachments.array().length === 0)
		sendCitation(message, args);
	else
		downloadCitation(message, args);

}

module.exports = { name, synthax, description, explication, execute };


function log(text) {
	require('../services/log').logStdout(text, name, null);
}

function err(text, msg, e) {
	require('../services/log').logError(text, name, msg ?? null, e ? e.stack : null)
}

/** formate le nom de la personne de manière a respecter les règles
 * 
 * @param {string} person 
 * @returns {string | boolean} renvoie false si la personne ne doit pas apparaitre dans les citations
 */
function respectRules(person) {

	const rules = JSON.parse(fs.readFileSync(`./config/citation_rules.json`))

	if (string.match(person, Object.keys(rules))) {

		person = string.normalize(person);

		if (rules[person] === null)
			return false;
		else
			return rules[person];
	}
	else
		return person;

}

/** 
 * @param {*} message 
 * @param {*} args 
 */
async function sendCitation(message, args) {

	let person = null;
	let firstFolder = null;
	let secondFolder = null;

	if (args[0]) {

		person = args.join("");

		if (person.includes(`.`))
			return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

		person = respectRules(person);

		if (!person)
			return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

		firstFolder = person.charAt(0).toUpperCase();
		secondFolder = firstFolder.concat(person.charAt(1).toLowerCase())
	}
	else {

		const firstFolderContent = fs.readdirSync(`./resources/citations`);
		firstFolder = firstFolderContent[getRandomInt(firstFolderContent.length)];

		const secondFolderContent = fs.readdirSync(`./resources/citations/${firstFolder}`);
		secondFolder = secondFolderContent[getRandomInt(secondFolderContent.length)];

		person = secondFolder;
	}

	const quotes = fs.readdirSync(`./resources/citations/${firstFolder}/${secondFolder}`)
		.filter(filename => filename.toLowerCase().startsWith(person.toLowerCase()))

	let sendedMessage = null;

	const filePath = `./resources/citations/${firstFolder}/${secondFolder}/${quotes[getRandomInt(quotes.length)]}`;

	if (quotes.length === 0)
		return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
	else {
		try {
			sendedMessage = await message.channel.send({
				files: [filePath]
			})
		}
		catch (e) {
			err("Impossible d'envoyer un message sur ce channel", message, e);
		}
	}

	message.delete();

	if (!sendedMessage || message.channel.type === 'dm')
		return;
	else
		createDeleteReactions(sendedMessage, message, filePath);

}


async function createDeleteReactions(sendedMessage, originalMessage, filePath) {

	await sendedMessage.react('🚽').catch(e => err("Impossible de reagir a ce message", sendedMessage, e));

	const filter = (reaction, user) => reaction.emoji.name === '🚽' || (reaction.emoji.name === '🗑️' && config.discord.gods.includes(user.id));
	const collector = sendedMessage.createReactionCollector(filter, { time: 24 * 60 * 60 * 1000, max: 8, dispose: true });

	let nbReactToilet = 0;

	collector.on('collect', r => {

		nbReactToilet++;

		if (nbReactToilet < 8 && r.emoji.name === '🚽')
			return;

		try {
			fs.unlinkSync(filePath);
			log(`Suppression du fichier ${filePath}`)

			const fileDirname = path.dirname(filePath);

			if (fs.readdirSync(fileDirname).length === 0) {
				fs.rmdirSync(fileDirname);
				log(`Le dossier ${fileDirname} est vide. Suppression du dossier`)
			}


			if (fs.readdirSync(path.dirname(fileDirname)).length === 0) {
				fs.rmdirSync(path.dirname(fileDirname))
				log(`Le dossier ${path.dirname(fileDirname)} est vide. Suppression du dossier`)
			}
		}
		catch (e) {
			err(`Impossible de supprimer le fichier ${filePath} ou un de ses parents.`, null, e)
		}

		sendedMessage.delete();
		originalMessage.channel.send("La citation a été supprimée ! Merci du signalement").catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));
	})

	collector.on('remove', r => {
		nbReactToilet--;
	})
}

async function downloadCitation(message, args) {

	if (!args[0])
		return message.channel.send("Il me faut l'identité de cette personne (en 1 mot)").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

	let person = args.join("");

	if (person.includes(`.`) || person.includes(`/`) || person.includes(`\\`))
		return message.channel.send("Je ne peux pas accepter ça :eyes:").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));



	person = respectRules(person);

	if (!person)
		return message.channel.send("Je ne peux pas accepter ça :eyes:").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));


	const firstFolder = person.charAt(0).toUpperCase();
	const secondFolder = firstFolder.concat(person.charAt(1).toLowerCase());

	const folderName = `./resources/citations/${firstFolder}/${secondFolder}`;

	if (!fs.existsSync(folderName)) {
		try {
			fs.mkdirSync(folderName, { recursive: true });
			log(`Création du dossier ${folderName}`);
		}
		catch (e) {
			err(`Impossible de créer le dossier ${folderName}`, null, e);
		}
	}



	for (const attachment of message.attachments.array()) {

		const fileExtension = path.extname(attachment.name);

		let filename = person.charAt(0).toUpperCase() + person.slice(1).toLowerCase()

		const nbFiles = fs.readdirSync(folderName)
			.filter(file => file.startsWith(filename))
			.length;

		if (nbFiles > 0)
			filename = filename.concat(nbFiles)

		filename = filename.concat(`-${message.author.id}`).concat(fileExtension);

		try {
			await download(attachment.url, path.join(folderName, filename));
		}
		catch (e) {
			err("Impossible de télécharger ce fichier", message, e);
		}

		log(`1 Citation ajoutée pour ${person} par ${message.author.username} (${filename})`);
	}

	message.delete()
	return message.channel.send(`${message.attachments.array().length ? "Citation ajoutée" : "Citations ajoutées"} à la base de données !`).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
}

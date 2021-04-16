const fs = require('fs')
const download = require('../utils').download;
const rules = require('../config/citation_rules.json');

const name = "citation"

const synthax = `${name} [<personne>]`

const description = "Lance une citation très philosophique d'une personne dans la bdd"

const explication = `Cette commande vous renvoie une citation prise hors contexte !
Si le nom d'une personne est spécifié (en 1 mot), cherche une citation de cette personne
Si vous envoyez une citation (en image) avec le nom d'une personne (en 1 mot), l'ajoute a la base de données`

async function execute(message, args) {

	if (!fs.readdirSync("./resources/citations"))
		return err("Le dossier resources de citations n'existe pas", null, null);

	// 1er et 2e lettre de la personne dont on veut la citation
	let firstLetter;
	let secondLetter;

	// s'il n'y a pas d'attachments, on renvoie une citation
	if (message.attachments.array().length === 0) {
		// personne recherchée
		let person;

		// si on cherche une personne en particulier
		if (args[0]) {

			//on met tout en 1 mot
			args[0] = args.join("");

			// si un point est dans le nom de la personne, on evite (pour éviter de récuperer des fichiers du bot)
			if (args[0].includes(`.`))
				return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

			// on change le nom de la personne en fonction des règles et alias défini
			person = respectRules(args[0]);

			if (!person)
				return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));


			// on récup la 1er lettre de la personne en Maj
			firstLetter = person.charAt(0).toUpperCase();

			// s'il y a une deuxieme lettre, on la recup
			if (person.charAt(1))
				secondLetter = person.charAt(1).toLowerCase();
			else
				secondLetter = "";

			//s'il n'existe aucun dossier pour ces 2 premieres lettres => tant pis
			if (!fs.existsSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`))
				return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
		}
		else {
			// on génére une premiere lettre au hasard
			const FirstLetterFolderContent = fs.readdirSync(`./resources/citations`);

			firstLetter = FirstLetterFolderContent[getRandomInt(FirstLetterFolderContent.length)].charAt(0);


			//si un dossier avec cette première lettre existe, on en récupère le contenu et on chope un dossier au hasard

			const SecondLetterFolderContent = fs.readdirSync(`./resources/citations/${firstLetter}`);

			secondLetter = SecondLetterFolderContent[getRandomInt(SecondLetterFolderContent.length)].charAt(1);



		}

		// on formatte la recherche correctement
		let formatted;

		if (person) {

			// la premiere lettre en majuscule
			firstLetter = person.charAt(0).toUpperCase();

			//la seconde en minuscule si elle existe
			if (person.charAt(1))
				formatted = firstLetter.concat(person.substring(1, person.length).toLowerCase());
			else
				formatted = firstLetter;
		}

		const folderContent = fs.readdirSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`);

		// on récupère le fichier avec toutes les citaitons qui matchent avec la recherche
		let quotes;

		if (person) {
			// on formate le nom du fichier de la meme manière que le nom de la personne recherchée
			quotes = folderContent.filter(file =>
				file.charAt(0).toUpperCase()                            // la première lettre en majuscule
					.concat(file.substring(1, file.length).toLowerCase())   // les autres lettres en minuscules
					.startsWith(formatted))                                 // on filtre toutes les citations dont le nom commence par la recherche
		}
		else {
			quotes = folderContent.filter(file =>
				firstLetter.concat(secondLetter)
			)
		}

		// si on ne trouve aucune citation
		if (quotes.length === 0)
			return message.channel.send("Je n'ai aucune citation pour cette personne").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

		// on chope la citation a envoyer et on l'envoie
		const fileToSend = quotes[getRandomInt(quotes.length)];

		// on envoie le message
		let sendedMessage = await message.channel.send({ files: [`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}/${fileToSend}`] }).catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));

		// si on n'a pas réussi a envoyer le message, on s'en fout du message
		if (!sendedMessage || message.channel.type === 'dm')
			return;

		// on ajoute une reaction pour virer la citation
		const reaction = await sendedMessage.react('🚽').catch(e => err("Impossible de reagir a ce message", sendedMessage, e));

		// on attend les reactions 🚽
		// au bout de 8 reactions en moins de 24h, on retire le message et la citation
		// sinon on retire simplement les reactions
		const filter = (reaction, user) => reaction.emoji.name === '🚽';
		const collector = sendedMessage.createReactionCollector(filter, { time: 24 * 60 * 60 * 1000, max: 8, dispose: true });

		collector.on('collect', r => {

			if (collector.total < 8)
				return;

			log(`Suppression du fichier ./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}/${fileToSend}`);

			// on supprime le fichier qui a été report
			try {
				fs.unlinkSync(`./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}/${fileToSend}`);
			}
			catch (e) {
				err(`Impossible de supprimer le fichier ./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}/${fileToSend}`, null, e);
			}

			// on supprime le message
			sendedMessages.delete();
			message.channel.send("La citation a été supprimée ! Merci du signalement").catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));

		});

		collector.on('end', c => {

			if (collector.total < 8) {
				reaction.remove().catch(e => err("Impossible de clear les reactions", null, e));
				return;
			}
		});

		message.delete().catch(e => err("Impossible de supprimer ce message", message, e));

	}

	// s'il y a un attachment, on regarde si on la télécharge
	else {

		if (!args[0])
			return message.channel.send("Il me faut l'identité de cette personne (en 1 mot)").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

		//on met tout en 1 mot
		args[0] = args.join("");

		if (args[0].includes(`.`))
			return message.channel.send("Je ne peux pas accepter ça :eyes:").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));

		// on change le nom de la personne en fonction des règles et alias défini
		person = respectRules(args[0]);

		if (!person)
			return message.channel.send("Impossible de télécharger cette citation").catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));


		const firstLetter = person.charAt(0).toUpperCase();

		// on créé le dossier avec la premiere lettre de la personne si besoin
		if (!fs.existsSync(`./resources/citations/${firstLetter}`)) {
			try {
				fs.mkdirSync(`./resources/citations/${firstLetter}`);
				log(`Création du dossier ./resources/citations/${firstLetter}`);
			}
			catch (e) {
				err(`Impossible de créer le dossier ./resources/citations/${firstLetter}`, null, e);
			}
		}

		// on créé le dossier avec la seconde lettre (ou sans) si besoin
		const secondLetter = person.charAt(1).toLowerCase() ?? "";

		const folderName = `./resources/citations/${firstLetter}/${firstLetter.concat(secondLetter)}`

		if (!fs.existsSync(folderName)) {
			try {
				fs.mkdirSync(folderName);
				log(`Création du dossier ${folderName}`);
			}
			catch (e) {
				err(`Impossible de créer le dossier ${folderName}`, null, e);
			}
		}


		let imgName;

		for (attachments of message.attachments.array()) {

			// on récupère le format de l'attachment
			const imgFormat = attachments.name.split(".")[attachments.name.split(".").length - 1];

			//on formatte le nom du fichier
			const formattedNameFile = firstLetter.concat(secondLetter !== "" ?
				person.substring(1, person.length).toLowerCase()
				: "");

			//on récupère le nombre de fichiers ayant deja le meme nom 
			const nbFiles = fs.readdirSync(folderName).filter(file => file.startsWith(`${formattedNameFile}`)).length;

			//on formatte tout ca correctement
			imgName = `${formattedNameFile}${nbFiles}-${message.author.id}.${imgFormat}`;

			// et on télécharge
			try {
				await download(attachments.url, `${folderName}/${imgName}`);
			}
			catch (e) {
				err("Impossible de télécharger ce fichier", message, e);
			}
		}

		log(`${message.attachments.array().length} ${message.attachments.array().length ? "Citation ajoutée" : "Citations ajoutées"} pour ${person} par ${message.author.username} (${imgName})`);

		return message.channel.send(`${message.attachments.array().length ? "Citation ajoutée" : "Citations ajoutées"} à la base de données !`).catch(e => err("Impossible d'envoyer un essage sur ce channel", message, e));
	}

}

module.exports = { name, synthax, description, explication, execute };

function log(text) {
	require('../utils').logStdout(text, name, null);
}

function err(text, msg, err) {
	require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}

/** retourne un entier aleatoire compris entre 0 et max
 * 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(max) {
	if (!max)
		throw new Exception("getRandomInt prend un paramètre");

	return Math.floor(Math.random() * Math.floor(max));
}


/** formate le nom de la personne de manière a respecter les règles
 * 
 * @param {string} person 
 * @returns {string | boolean} renvoie false si la personne ne doit pas apparaitre parmi les 
 */
function respectRules(person) {

	person = person.toLowerCase();

	if (!rules[person])
		return person;
	else {
		if (rules[person] === "")
			return false;
		else
			return rules[person];
	}

}
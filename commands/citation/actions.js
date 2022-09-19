const path = require("path");
const fs = require("fs");
const { log, err } = require("../../services/log");
const { capitalizeFirstLetter } = require("../../services/string");
const { download } = require("../../services/http");
const { Op } = require("sequelize");
const { getRandomInt } = require("../../services/numbers");
const { ChannelType } = require("discord.js");

function init() {

}
function shutdown() {

}
async function execute(interaction, options) {
	if(options.find(o => o.name === "citation")) {
		downloadCitation(interaction, options);	
	}
	else {
		sendCitation(interaction, options);
	}
}

async function downloadCitation(interaction, options) {
	let person = options.find(o => o.name === "personne")?.value;
	const content = options.find(o => o.name === "contenu")?.value;
	const file = options.find(o => o.name === "citation")?.attachment;

	if(!person) {
		return interaction.reply({ content: "Veuillez indiquer qui est sur cette citation !", ephemeral: true });
	}

	// create folders before download
	const citationFolder = path.join(
		__dirname,
		"..",
		"..",
		"files",
		"citations"
	);

	person = capitalizeFirstLetter(person.replaceAll(" ", ""));

	// file folder creation
	const fileFolder = path.join(citationFolder, person.charAt(0), person.substring(0, 2));

	if(!fs.existsSync(fileFolder)) {
		fs.mkdirSync(fileFolder, { recursive: true });
		log(`Création du fichier ${fileFolder}`, "citation.js");
	}

	// download file
	const numberOfExistingFilesForThisPerson = fs.readdirSync(fileFolder).filter(f => f.startsWith(person)).length;
	const filePath = path.join(fileFolder, `${person}${numberOfExistingFilesForThisPerson}${path.extname(file.url)}`);

	try {
		await download(file.url, filePath);
	}
	catch (e) {
		err("Impossible de télécharger la citation", "citation", interaction, e.stack);
		return interaction.reply({ content: "Etrange.... Je n'ai pas pu télécharger ta citation", ephemeral: true });
	}

	// creating citation in database
	const user = await interaction.client.db.User.findByPk(interaction.user.id);

	if(!user) {
		await interaction.client.db.User.create({ discordid: interaction.user.id, god: false });
	}

	await interaction.client.db.Citation.create({
		person,
		content,
		authorId: interaction.user.id,
		fileLocation: filePath
	});

	interaction.reply({ content: "Citation ajoutée à la base de donnée !", ephemeral: true });
}

async function sendCitation(interaction, options) {
	let person = options.find(o => o.name === "personne")?.value;
	const content = options.find(o => o.name === "contenu")?.value;

	const whereObject = {
		deleteDate: {
			[Op.eq]: null
		}
	};

	if(person) {
		person = capitalizeFirstLetter(person.replaceAll(" ", ""));

		whereObject.person = {
			[Op.iLike]: "%" + person + "%"
		};
	}

	if(content) {
		whereObject.content = {
			[Op.iLike]: "%" + content + "%"
		};
	}

	const citations = await interaction.client.db.Citation.findAll({
		where: whereObject
	});

	if(!citations || citations.length <= 0) {
		return interaction.reply({ content: "Aucune citation n'existe pour ces critères", ephemeral: true });
	}

	let citation;
	do {
		citation = citations[getRandomInt(citations.length)];
	}
	while(!fs.existsSync(citation.fileLocation));

	// check if attachment size is more than the bot can send
	if(fs.statSync(citation.fileLocation).size <= 8 * 1024 * 1024) {
		interaction.reply(
			{ 
				files: [{
					name: path.basename(citation.fileLocation),
					attachment: citation.fileLocation,
					description: `Citation de ${citation.person}`
				}] 
			}
		);
	}
	else {
		interaction.reply({ content: `http://${process.env.API_BASE_PATH}:${process.env.API_PORT}/citations/${citation.id}` });
	}

	if(interaction.channel.type === ChannelType.DM)
		return;
	
	createDeleteReaction(interaction, citation);
}

async function createDeleteReaction(interaction) {
	const response = await interaction.fetchReply();

	try {
		await response.react("🚽");
	}
	catch(e) {
		err("Impossible de réagir sur ce message", "citation", interaction, e.stack);
		return;
	}




}

async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

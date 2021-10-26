const fs = require("fs");
const { debug } = require("../services/log");
const { getJsonTemplate } = require("../services/template");

function createBotStructure() {

	if (!fs.existsSync("./templates/bot.structure.json"))
		throw new Error("Le fichier template n'existe pas, impossible de recréer la structure du bot");

	const structure = getJsonTemplate("bot.structure");

	for (const [folderName, folderContent] of Object.entries(structure))
		createFolder(folderName, folderContent);
}

function createFolder(folderName, content, root = ".") {

	if (!fs.existsSync(`${root}/${folderName}`)) {
		fs.mkdirSync(`${root}/${folderName}`);
		debug(`Création du dossier ${root}/${folderName}`, "structure.js");
	}

	for (const [folder, subFolders] of Object.entries(content))
		createFolder(folder, subFolders, `${root}/${folderName}`);
}

module.exports = {
	createBotStructure
};
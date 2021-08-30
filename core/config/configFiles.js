const fs = require("fs");
const template = require("../../templates/configFiles.json");
const { debug } = require("../../services/log");

function createConfigFolderAndFiles() {

	if (!fs.existsSync("./config")) {
		fs.mkdirSync("./config");
		debug('Création du dossier ./config', "configFiles");
	}

	for (const [filename, fileContent] of Object.entries(template)) {

		if (!fs.existsSync(`./config/${filename}.json`)) {
			fs.writeFileSync(`./config/${filename}.json`, JSON.stringify(fileContent));
			debug(`Creation du fichier ./config/${filename}.json`, "configFiles");
		}

	}
}



module.exports = { createConfigFolderAndFiles }
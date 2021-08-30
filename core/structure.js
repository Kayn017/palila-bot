const fs = require("fs")
const structure = require('../templates/structure.json');
const { debug } = require('../services/log')

function createStructure() {
	for (const [folderName, folderContent] of Object.entries(structure))
		createFolderAndContent(folderName, folderContent);
}

function createFolderAndContent(folderName, content, root = ".") {

	if (!fs.existsSync(`${root}/${folderName}`)) {
		fs.mkdirSync(`${root}/${folderName}`)
		debug(`Création du dossier ${root}/${folderName}`, 'structure');
	}

	if (content !== null) {
		for (const [folder, subFolders] of Object.entries(content))
			createFolderAndContent(folder, subFolders, `${root}/${folderName}`)
	}

}


module.exports = {
	createStructure
}
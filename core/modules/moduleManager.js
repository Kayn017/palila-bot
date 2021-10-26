const fs = require("fs");
const { Collection } = require("discord.js");
const path = require("path");

function fetchModules(modulesFolder) {
	if (!fs.existsSync(modulesFolder))
		throw new Error(`Le dossier ${modulesFolder} n'existe pas`);

	const modules = new Collection();
	const modulesFolderContent = fs.readdirSync(modulesFolder);

	for (const folder of modulesFolderContent) {
		const module = require(path.join(
			modulesFolder,
			folder
		));
		modules.set(module.name, module);
	}

	return modules;
}

async function initModules(client) {

	client.modules.forEach(async mod => {
		await mod.init(client);
	});

}

module.exports = {
	fetchModules,
	initModules
};
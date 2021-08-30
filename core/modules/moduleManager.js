const fs = require('fs');
const Discord = require('discord.js');
const path = require('path');


function fetchModules(modulesFolder) {

	if (!fs.existsSync(modulesFolder))
		throw new Error("The given folder doesn't exist.");

	const modulesFiles = fs.readdirSync(modulesFolder).filter(entry => entry.endsWith('.js'));

	const modules = new Discord.Collection();

	for (const file of modulesFiles) {

		const module = require(path.join(modulesFolder, file));

		modules.set(module.name, module);
	}

	return modules;
}


module.exports = {
	fetchModules
}
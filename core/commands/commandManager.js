const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const process = require("process");
const { log } = require("../../services/log");

function fetchCommands(commandsFolder) {
	if (!fs.existsSync(commandsFolder))
		throw new Error(`Le dossier ${commandsFolder} n'existe pas`);

	const commands = new Collection();
	const cmdFolders = fs.readdirSync(commandsFolder);

	for (const folder of cmdFolders) {
		const command = require(path.join(
			commandsFolder,
			folder
		));

		if (fs.readdirSync(path.join(
			commandsFolder,
			folder,
			"subcommands"
		)).length > 0)
			command.subcommands = fetchCommands(path.join(
				commandsFolder,
				folder,
				"subcommands"
			));
		else
			command.subcommands = null;

		commands.set(command.name, command);
	}

	return commands;
}

async function initCommands(client) {

	await client.application.commands.fetch();

	// on initialise les commandes
	// on ajoute les nouvelles commandes et on actualise les commandes déjà existantes
	client.commands.forEach(async cmd => {

		await cmd.init(client);

		let distantCommand;

		if (global.devEnv) {
			const devGuild = await client.guilds.fetch(process.env.DEVGUILD);
			const guildCommands = await devGuild.commands.fetch();
			distantCommand = guildCommands.find(c => c.name === cmd.name);
		}
		else {
			const applicationCommands = await client.application.commands.fetch();
			distantCommand = applicationCommands.find(c => c.name === cmd.name);
		}

		const data = {
			name: cmd.name,
			description: cmd.description,
			options: initOptions(cmd)
		};

		if (distantCommand)
			client.application.commands.edit(distantCommand, data, global.devEnv ? process.env.DEVGUILD : null);
		else
			client.application.commands.create(data, global.devEnv ? process.env.DEVGUILD : null);
	});

	// on supprime les vieilles commandes qui n'existent plus en local
	let oldCommands;

	if (global.devEnv) {
		const devGuild = await client.guilds.fetch(process.env.DEVGUILD);
		const guildCommands = await devGuild.commands.fetch();
		oldCommands = guildCommands.filter(c => !client.commands.has(c.name));
	}
	else {
		const applicationCommands = await client.application.commands.fetch();
		oldCommands = applicationCommands.filter(c => !client.commands.has(c.name));
	}


	oldCommands.forEach(c => {
		c.delete();
		log(`Suppression de la commande ${c.name}. Celle-ci n'est plus présente en local.`, "commandManager");
	});
}

function initOptions(command) {

	const options = [];

	if (command.subcommands) {
		for (const [name, subcmd] of command.subcommands.entries()) {
			const option = {};

			option.name = name;
			option.description = subcmd.description;
			option.type = subcmd.subcommands ? "SUB_COMMAND_GROUP" : "SUB_COMMAND";
			option.options = initOptions(subcmd);

			options.push(option);
		}
	}

	options.push(...command.options);

	return options;
}

module.exports = {
	fetchCommands,
	initCommands
};
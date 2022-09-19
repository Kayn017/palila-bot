const fs = require("fs");
const path = require("path");
const { Collection, ApplicationCommandOptionType } = require("discord.js");
const { log } = require("../../services/log");
const process = require("process");

function fetchCommands(commandsFolder) {
	if (!fs.existsSync(commandsFolder))
		throw new Error(`Le dossier ${commandsFolder} n'existe pas`);

	const commands = new Collection();
	const cmdFolders = fs.readdirSync(commandsFolder).filter(f => !f.includes(".gitkeep"));

	for (const folder of cmdFolders) {
		const command = require(path.join(
			commandsFolder,
			folder
		));

		const subcommands = fs.readdirSync(path.join(commandsFolder, folder, "subcommands")).filter(f => !f.includes(".gitkeep"));

		if (subcommands.length > 0)
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

async function initGlobalCommands(client) {

	// on initialise les commandes
	// on ajoute les nouvelles commandes et on actualise les commandes déjà existantes
	client.commands.forEach(async cmd => {

		if(!cmd.globalCommand) return;

		await initCommand(cmd, client);

		const applicationCommands = await client.application.commands.fetch();
		const distantCommand = applicationCommands.find(c => c.name === cmd.name);
		
		const data = {
			name: cmd.name,
			description: cmd.description,
			options: initOptions(cmd)
		};

		if (distantCommand)
			client.application.commands.edit(distantCommand, data, null);
		else
			client.application.commands.create(data, null);
	});

	// on supprime les vieilles commandes qui n'existent plus en local
	const applicationCommands = await client.application.commands.fetch();
	const oldCommands = applicationCommands.filter(c => !client.commands.has(c.name));

	oldCommands.forEach(c => {
		c.delete();
		log(`Suppression de la commande ${c.name}. Celle-ci n'est plus présente en local.`, "commandManager");
	});
}

async function initDevCommands(client) {
	client.commands.forEach(async cmd => {

		const devGuild = await client.guilds.fetch(process.env.DEVGUILD);

		await initCommand(cmd, client, devGuild);

		const guildCommands = await devGuild.commands.fetch();
		const distantCommand = guildCommands.find(c => c.name === cmd.name);


		const data = {
			name: cmd.name,
			description: cmd.description,
			options: initOptions(cmd)
		};

		if (distantCommand)
			client.application.commands.edit(distantCommand, data, process.env.DEVGUILD);
		else
			client.application.commands.create(data, process.env.DEVGUILD);
	});

	// on supprime les vieilles commandes qui n'existent plus en local
	const devGuild = await client.guilds.fetch(process.env.DEVGUILD);
	const guildCommands = await devGuild.commands.fetch();
	const oldCommands = guildCommands.filter(c => !client.commands.has(c.name));

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
			option.type = subcmd.subcommands ? ApplicationCommandOptionType.SubcommandGroup : ApplicationCommandOptionType.Subcommand;
			option.options = initOptions(subcmd);

			options.push(option);
		}
	}

	options.push(...command.options);

	return options;
}

async function initCommand(cmd, client, guild) {
	await cmd.init(client, guild);

	if (cmd.subcommands) {
		cmd.subcommands.forEach(subcmd => initCommand(subcmd, client, guild));
	}
}

module.exports = {
	fetchCommands,
	initGlobalCommands,
	initCommand,
	initOptions,
	initDevCommands
};
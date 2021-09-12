const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const { log } = require("../../services/log");
const process = require("process");

function fetchCommands(commandsFolder) {

	if (!fs.existsSync(commandsFolder))
		throw new Error("The given folder doesn't exist.");

	const commandsFiles = fs.readdirSync(commandsFolder).filter(entry => entry.endsWith(".js"));

	const commands = new Discord.Collection();

	for (const file of commandsFiles) {

		const command = require(path.join(commandsFolder, file));

		command.subcommands = findSubcommands(command.name, commandsFolder);

		commands.set(command.name, command);
	}

	return commands;
}
function findSubcommands(commandName, rootFolder) {

	if (!fs.existsSync(rootFolder))
		throw new Error("The given folder doesn't exist.");

	const subcommandsFolder = fs.readdirSync(rootFolder).find(entry => entry.startsWith(`${commandName}_subcommands`));

	if (!subcommandsFolder)
		return null;
	else {
		const subcommands = new Discord.Collection();

		const subcommandsFiles = fs.readdirSync(path.join(rootFolder, subcommandsFolder)).filter(entry => entry.endsWith(".js"));

		for (const file of subcommandsFiles) {

			const subcommand = require(path.join(rootFolder, subcommandsFolder, file));

			subcommand.subcommands = findSubcommands(subcommand.name, path.join(rootFolder, subcommandsFolder));

			subcommands.set(subcommand.name, subcommand);
		}

		return subcommands;
	}
}

async function initCommands(client) {

	const config = require("../../config/config.json");

	await client.application.commands.fetch();

	client.commands.forEach(async cmd => {

		cmd.init(client);

		let command;

		if (process.argv.includes("--VERBOSE")) {
			// weird thing that gets all the commands that are available locally
			command = (await (await client.guilds.fetch(config.discord.devGuild)).commands.fetch()).find(c => c.name === cmd.name);
		}
		else {
			command = (await client.application.commands.fetch()).find(c => c.name === cmd.name);
		}

		const data = {
			name: cmd.name,
			description: cmd.description,
			options: initOptions(cmd)
		};

		if (command) {
			client.application.commands.edit(command, data, process.argv.includes("--VERBOSE") ? config.discord.devGuild : null);
		}
		else {
			client.application.commands.create(data, process.argv.includes("--VERBOSE") ? config.discord.devGuild : null);
		}
	});


	let oldCommands;

	if (process.argv.includes("--VERBOSE")) {
		// weird thing that gets all the commands that are not available locally
		oldCommands = (await (await client.guilds.fetch(config.discord.devGuild)).commands.fetch()).filter(c => !client.commands.has(c.name));
	}
	else {
		oldCommands = (await client.application.commands.fetch()).filter(c => !client.commands.has(c.name));
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
	findSubcommands,
	initCommands,
	initOptions
};
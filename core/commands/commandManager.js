const fs = require("fs");
const Discord = require('discord.js');
const path = require("path");

function fetchCommands(commandsFolder) {

	if (!fs.existsSync(commandsFolder))
		throw new Error("The given folder doesn't exist.");

	const commandsFiles = fs.readdirSync(commandsFolder).filter(entry => entry.endsWith('.js'));

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

		const subcommandsFiles = fs.readdirSync(path.join(rootFolder, subcommandsFolder)).filter(entry => entry.endsWith('.js'));

		for (const file of subcommandsFiles) {

			const subcommand = require(path.join(rootFolder, subcommandsFolder, file));

			subcommand.subcommands = findSubcommands(subcommand.name, path.join(rootFolder, subcommandsFolder))

			subcommands.set(subcommand.name, subcommand);
		}

		return subcommands;
	}
}

function initCommands(client) {

	const config = require("../../config/config.json");

	client.commands.forEach(cmd => {

		cmd.init(client);

		const command = client.application.commands.cache.find(c => c.name === cmd.name)

		if (command) {
			client.application.commands.edit(command, {
				name: cmd.name,
				description: cmd.description
			}, process.argv.includes("--VERBOSE") ? config.discord.devGuild : null);
		}
		else {
			client.application.commands.create({
				name: cmd.name,
				description: cmd.description
			}, process.argv.includes("--VERBOSE") ? config.discord.devGuild : null);
		}
	});
}

module.exports = {
	fetchCommands,
	findSubcommands,
	initCommands
}
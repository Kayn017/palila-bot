const { fetchCommands, initCommands } = require("./commandManager");
const { handleCommand, executeCommand } = require("./commandHandler");

module.exports = {
	fetchCommands,
	initCommands,
	handleCommand,
	executeCommand
};
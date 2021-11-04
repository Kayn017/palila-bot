const { fetchCommands, initGlobalCommands, initDevCommands } = require("./commandManager");
const { handleCommand, executeCommand } = require("./commandHandler");
const { initGuildCommands } = require("./guildCommandManager");

async function initCommands(client) {
	if(global.devEnv) {
		await initDevCommands(client);
	}
	else {
		await initGlobalCommands(client);
		await initGuildCommands(client);
	}
}


module.exports = {
	fetchCommands,
	initGlobalCommands,
	handleCommand,
	executeCommand,
	initGuildCommands,
	initDevCommands,
	initCommands
};
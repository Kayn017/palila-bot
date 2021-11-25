const { init, shutdown, execute, middleware, configure } = require("./actions");
const { name, author, description, explication, options, intents, permissions, globalCommand } = require("./infos");
const configuration = require("./configuration");

module.exports = {
	// actions
	init,
	shutdown,
	execute,
	middleware,
	configure,

	// infos
	name,
	author,
	description,
	explication,
	options,
	intents,
	permissions,
	globalCommand,

	// configuration
	configuration	
};
const { init, shutdown, configure } = require("./actions");
const { name, author, description, explication, intents, permissions } = require("./infos");

module.exports = {
	// actions
	init,
	shutdown,
	configure,
	// infos
	name,
	author,
	description,
	explication,
	intents,
	permissions,
};
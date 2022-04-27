const { name, intents, exitAfterLaunch } = require("./infos");
const { execute } = require("./actions");

module.exports = {
	name,
	intents,
	exitAfterLaunch,
	execute
};
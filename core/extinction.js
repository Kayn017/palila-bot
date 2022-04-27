const process = require("process");

function handleExtinctionSignal(client) {
	process.on("SIGINT", () => {
		client.commands.forEach(c => c.shutdown());
		client.modules.forEach(m => m.shutdown());
		client.api.routes.forEach(r => r.shutdown());
	});
}

module.exports = handleExtinctionSignal;
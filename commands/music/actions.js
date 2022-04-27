const { launchWorker } = require("../../services/worker");
const { workers } = require("./data");
const { debug } = require("../../services/log");


function init() {

}
function shutdown() {
	console.log("ba");
	for(const [, worker] of Object.entries(workers)) {
		worker.terminate();
	}
}
async function execute() {

}
async function middleware(interaction) {
	if(!interaction.member.voice.channelId) {
		interaction.reply({ content: "Vous devez être connecté à un salon vocal pour utiliser cette commande", ephemeral: true });
		return true;
	}

	if(!workers[interaction.member.voice.channelId]) {
		workers[interaction.member.voice.channelId] = launchWorker("music", { channelId: interaction.member.voice.channelId });

		interaction.worker = workers[interaction.member.voice.channelId];

		return new Promise((resolve) => {
			interaction.worker.on("online", () => {
				debug("Worker lancé", "music");
				resolve();
			});
		});
	}
	else {
		interaction.worker = workers[interaction.member.voice.channelId];
	}
}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

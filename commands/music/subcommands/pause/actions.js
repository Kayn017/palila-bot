const { postMessageAndAwaitResponse } = require("../../../../services/worker");

function init() {

}
function shutdown() {

}
async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const response = await postMessageAndAwaitResponse(interaction.worker, { action: "pause" });
	interaction.editReply({ content: response.message, ephemeral: true });

}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

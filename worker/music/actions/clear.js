const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");
const player = require("../player");

module.exports = () => {

	player.queue.clearQueue();	

	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "File d'attente supprimée !" });
};
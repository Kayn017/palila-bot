const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");
const player = require("../player");
const { nowPlayingSong } = require("../player/queue");

module.exports = () => {

	if(!nowPlayingSong()) {
		parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "Vous n'écoutez rien pour le moment" });
		return;
	}

	player.controls.pause();
};
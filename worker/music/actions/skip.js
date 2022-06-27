const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");
const { queue, controls } = require("../player");

module.exports = (connection) => {

	queue.nextSong();

	if(!queue.nowPlayingSong()) {
		controls.stop();
		return;
	}

	controls.play(connection);
	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "Musique suivante !" });
};
const { queue } = require("../player");
const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");

module.exports = async () => {

	const infos = queue.nowPlayingSong();

	if(!infos) {
		return parentPort.postMessage({ type: MESSAGE_TYPES.response, message: null });
	}

	infos.position = queue.positionInQueue(infos.url);

	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: infos });
};
const { queue } = require("../player");
const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");

module.exports = async () => {

	const res = [];

	for(const infos of queue.getQueue()) {
		res.push(infos);
	}

	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: res });	
};
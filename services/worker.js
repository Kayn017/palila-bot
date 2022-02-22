const { Worker } = require("worker_threads");
const path = require("path");
const { err, debug } = require("./log");



function launchWorker(workerName, options) {

	const worker = new Worker(
		path.join(
			__dirname,
			"..",
			"core",
			"worker",
			"workerLoader.js"
		)
	);

	worker.on("online", () => {
		const params = {
			workerName,
			options,
			dev: global.devEnv
		};
		worker.postMessage(params);
	});

	worker.on("exit", code => {
		if (code !== 0)
			err(`Le worker ${workerName} s'est arrêté. Le code retour est ${code}`, "worker");
		else
			debug(`Le worker ${workerName} s'est arrêté correctement.`, "worker");
	});

	worker.on("error", e => {
		err(`${e.message}`, "worker", undefined, e.stack);
	});

	worker.on("messageerror", e => {
		err(`${e.message}`, "worker", undefined, e.stack);
	});

	return worker;
}

function postMessageAndAwaitResponse(worker, message) {
	return new Promise( (resolve, reject) => {
		worker.postMessage(message);
		worker.on("message", msg => resolve(msg));
		worker.on("messageerror", err => reject(err));
	});
}

module.exports = {
	launchWorker,
	postMessageAndAwaitResponse
};
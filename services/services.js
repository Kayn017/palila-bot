const { Worker } = require("worker_threads");
const path = require("path");
const { err, debug } = require("./log");


function launchWorker(workerName, options) {

	const worker = new Worker(
		path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"core",
			"worker",
			"initWorker.js"
		)
	);

	worker.on("online", () => {
		const params = {
			workerName,
			options
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
		err(`ERROR : ${e.message}`, "worker", undefined, e.stack);
	});

	worker.on("messageerror", e => {
		err(`ERROR : ${e.message}`, "worker", undefined, e.stack);
	});
}


module.exports = {
	launchWorker
};
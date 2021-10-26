const worker = require("worker_threads");
const path = require("path");
const { Client } = require("discord.js");
const process = require("process");

const WORKER_FOLDER = path.join(
	// eslint-disable-next-line no-undef
	__dirname,
	"..",
	"..",
	"worker"
);

const params = worker.receiveMessageOnPort(worker.parentPort).message;
const workerName = params.workerName;
const options = params.options;

const workerToExecute = require(path.join(WORKER_FOLDER, `${workerName}.js`));

const client = new Client({
	intents: workerToExecute.intents
});


client.on("ready", () => {
	workerToExecute.execute(client, options);
});

client.login(process.env.TOKEN);
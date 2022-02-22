const worker = require("worker_threads");
const path = require("path");
const { Client } = require("discord.js");
const process = require("process");
require("dotenv").config();

const WORKER_FOLDER = path.join(
	__dirname,
	"..",
	"..",
	"worker"
);

const params = worker.receiveMessageOnPort(worker.parentPort).message;
const workerName = params.workerName;
const options = params.options;
global.devEnv = params.dev;

const workerToExecute = require(path.join(WORKER_FOLDER, workerName));

const client = new Client({
	intents: workerToExecute.intents
});


client.on("ready", async () => {
	await workerToExecute.execute(client, options);

	if(workerToExecute.exitAfterLaunch) {
		process.exit(0);
	}
});

client.login(process.env.TOKEN);
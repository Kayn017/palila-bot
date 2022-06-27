const { parentPort } = require("worker_threads");
const { createAudioResource } = require("@discordjs/voice");
const { MESSAGE_TYPES } = require("../../../services/worker");
const { err, debug } = require("../../../services/log");
const player = require("./player");
const { nowPlayingSong, nextSong } = require("./queue");
const loadDriver = require("../drivers");

async function play(connection) {

	const url = nowPlayingSong().url;

	// on charge le driver correspondant a l'url
	const driver = loadDriver(url);

	if(!driver)
		return parentPort.postMessage({ type: MESSAGE_TYPES.error, message: "URL invalide" });

	debug("Driver chargé !", "music worker");

	const stream = await driver.getReadableStream(url);

	const resource = createAudioResource(stream);

	player.on("error", error => {
		err(error, "music worker", undefined, error.stack);
	});

	player.on("stateChange", (oldState, newState) => {
		if(newState.status === "idle" && nowPlayingSong()) {
			debug("Fin de la musique", "music worker");
			nextSong();
			play(connection);
		}
	});

	if(connection.state.subscription) {
		player.play(resource);
	}
	player.once("subscribe", () => player.play(resource));

	connection.subscribe(player);	

	return;
}

function pause() {
	player.pause();
	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "Musique mise en pause !" });
	return;
}

function resume() {
	player.unpause();
	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "Reprise de la musique !" });
	return;
}

function stop() {
	player.stop();
	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: "Arrêt de la musique !" });
	return;
}

module.exports = {
	play,
	pause,
	resume,
	stop
};
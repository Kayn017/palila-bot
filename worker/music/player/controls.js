const { parentPort } = require("worker_threads");
const { createAudioResource } = require("@discordjs/voice");
const { MESSAGE_TYPES } = require("../../../services/worker");
const { err, debug } = require("../../../services/log");
const player = require("./player");
const { nowPlayingSong, nextSong, setNowPlayingStream } = require("./queue");
const loadDriver = require("../drivers");

async function play(connection) {

	const url = nowPlayingSong().url;

	// on charge le driver correspondant a l'url
	const driver = await loadDriver(url);

	if(!driver) {
		parentPort.postMessage({ type: MESSAGE_TYPES.error, message: "URL invalide" });
		return false;
	}
		
	debug("Driver chargé !", "music worker");

	const stream = await driver.getReadableStream(url);

	if(!stream) {
		parentPort.postMessage({ type: MESSAGE_TYPES.error, message: "Impossible de lire la video. Vérifiez si la vidéo est publique et accessible depuis la France." });
		return false;
	}

	setNowPlayingStream(stream);

	const resource = createAudioResource(stream);

	player.on("error", error => {
		err(error, "music worker", undefined, error.stack);
	});

	player.on("stateChange", (oldState, newState) => {
		if(newState.status === "idle" && nowPlayingSong()) {
			debug("Fin de la musique", "music worker");

			if(!nextSong())
				play(connection);
		}
	});

	if(connection.state.subscription) {
		player.play(resource);
	}
	player.once("subscribe", () => player.play(resource));

	connection.subscribe(player);	

	return true;
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
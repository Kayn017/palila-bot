const player = require("../player");
const { parentPort } = require("worker_threads");
const { MESSAGE_TYPES } = require("../../../services/worker");
const { debug } = require("../../../services/log");
const loadDriver = require("../drivers"); 

module.exports = async (connection, { url }) => {

	// on charge le driver correspondant a l'url
	const driver = await loadDriver(url);

	if(!driver)
		return parentPort.postMessage({ type: MESSAGE_TYPES.error, message: "URL invalide" });

	debug("Driver chargé !", "music worker");

	// enfin, on renvoie les infos de la musique qu'on joue au thread principal
	let music;
	try {
		music = await driver.getInfosFromURL(url);
	}
	catch(e) {
		return parentPort.postMessage({ type: MESSAGE_TYPES.error, message: e.message });
	} 
	
	// on ajoute la musique a la file d'attente
	player.queue.addToQueue(music);

	const infos = JSON.parse(JSON.stringify(music));

	infos.position = player.queue.positionInQueue(infos.url);

	// et on joue la musique si elle est la première dans la file d'attente
	if(player.queue.getQueue().length === 1) {
		const res = await player.controls.play(connection);

		if(res) {
			parentPort.postMessage({ type: MESSAGE_TYPES.response, message: infos });
		}

		return;
	}

	parentPort.postMessage({ type: MESSAGE_TYPES.response, message: infos });
	return;
};
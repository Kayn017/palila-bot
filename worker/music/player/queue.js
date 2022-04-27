let queue = [];

function addToQueue(infos) {
	queue.push(infos);
}

function clearQueue() {
	queue = [];
}

function nowPlayingSong() {
	return queue[0];
}

function nextSong() {
	queue.shift();
	return queue.length === 0;
}

function positionInQueue(url) {

	for(let i = 0; i < queue.length; i++) {
		if(queue[i].url === url) return i;
	}

	return -1;
}

function getQueue() {
	return queue;
}

module.exports = {
	addToQueue,
	getQueue,
	clearQueue,
	nowPlayingSong,
	nextSong,
	positionInQueue
};
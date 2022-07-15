let queue = [];
let nowPlayingStream;

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
	endNowPlayingStream();
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

function setNowPlayingStream(stream) {
	nowPlayingStream = stream;
}

function endNowPlayingStream() {
	nowPlayingStream.destroy();
}

module.exports = {
	addToQueue,
	getQueue,
	clearQueue,
	nowPlayingSong,
	nextSong,
	positionInQueue,
	setNowPlayingStream,
	endNowPlayingStream
};
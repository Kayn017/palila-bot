const ytdl = require("ytdl-core");

/**
 * 
 * @param {string} url 
 * @returns {ReadableStream}
 */
function getReadableStream(url) {
	return ytdl(url, {
		liveBuffer: 4000
	});
}

module.exports = {
	getReadableStream
};
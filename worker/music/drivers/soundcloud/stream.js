const scdl = require("soundcloud-downloader");

/**
 * 
 * @param {string} url 
 * @returns {ReadableStream}
 */
async function getReadableStream(url) {
	return await scdl.default.download(url);
}

module.exports = {
	getReadableStream
};
const ytdl = require("ytdl-core");

/**
 * 
 * @param {String} url 
 * @returns {boolean}
 */
function triggerByURL(url) {
	return ytdl.validateURL(url);
}

module.exports = {
	triggerByURL
};
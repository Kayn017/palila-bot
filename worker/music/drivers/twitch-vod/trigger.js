/**
 * 
 * @param {String} url 
 * @returns {boolean}
 */
async function triggerByURL(url) {
	return /https:\/\/www\.twitch\.tv\/videos\/[0-9]+/.test(url);
}

module.exports = {
	triggerByURL
};
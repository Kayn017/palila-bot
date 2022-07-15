/**
 * 
 * @param {String} url 
 * @returns {boolean}
 */
async function triggerByURL(url) {
	return /^https:\/\/www\.twitch\.tv\/(?!videos\/[0-9]+$)[a-zA-Z0-9_]+$/.test(url);
}

module.exports = {
	triggerByURL
};

/**
 * 
 * @param {String} url 
 * @returns {boolean}
 */
function triggerByURL(url) {
	return url.startsWith("https://soundcloud.com/");
}

module.exports = {
	triggerByURL
};
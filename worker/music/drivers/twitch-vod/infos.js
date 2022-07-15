const {  initTwitchClient, getVideoById, getTwitchVideoIdFromURL } = require("../../../../services/twitch");

async function getInfosFromURL(url) {

	initTwitchClient();

	const video = await getVideoById(getTwitchVideoIdFromURL(url));

	if(!video) {
		throw new Error("Vidéo inexistante ou privée.");
	}

	return {
		title: video.title,
		author: video.userDisplayName,
		url,
		cover: video.thumbnailUrl.replace("{width}", "470").replace("{height}", "265")
	};
}

module.exports = {
	getInfosFromURL
};
const ytdl = require("ytdl-core");



async function getInfosFromURL(url) {
	const allInfos = await ytdl.getInfo(url);

	return {
		title: allInfos.videoDetails.title,
		author: allInfos.videoDetails.author.name,
		url: allInfos.videoDetails.video_url,
		cover: allInfos.videoDetails.thumbnails[0].url
	};
}

module.exports = {
	getInfosFromURL
};
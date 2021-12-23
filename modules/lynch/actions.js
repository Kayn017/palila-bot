const { LocalCache } = require("../../services/cache");
const axios = require("axios");
const process = require("process");
const cache = LocalCache.get("lynch");

const LYNCH_CHANNEL_ID = "UUDLD_zxiuyh1IMasq9nbjrA";

async function init() {

	let history = cache.get("history");

	if(history === undefined) history = [];

	// "UUDLD_zxiuyh1IMasq9nbjrA"
	const test = await axios({
		method: "GET",
		url: "https://youtube.googleapis.com/youtube/v3/playlistItems",
		params: {
			part: "contentDetails",
			maxResults: 50,
			key: process.env.YOUTUBE_API_KEY,
			playlistId: LYNCH_CHANNEL_ID
		}
	});

}
function shutdown() {

}
module.exports = {
	init,
	shutdown,
};

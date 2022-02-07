require("dotenv").config();
const axios = require("axios");
const process = require("process");
const { LocalCache } = require("../services/cache");

const cache = LocalCache.get("lynch");
const LYNCH_CHANNEL_ID = "UUDLD_zxiuyh1IMasq9nbjrA";

// Définition du cache lynch
axios({
	method: "GET",
	url: "https://youtube.googleapis.com/youtube/v3/playlistItems",
	params: {
		part: "snippet",
		maxResults: 50,
		key: process.env.YOUTUBE_API_KEY,
		playlistId: LYNCH_CHANNEL_ID
	}
}).then( videos => {
	cache.set("history", videos.data.items.map( video => video.snippet.resourceId.videoId ));
	console.log("- Cache lynch set !");
});
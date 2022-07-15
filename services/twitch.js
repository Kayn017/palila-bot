const { ApiClient } = require("@twurple/api");
const { ClientCredentialsAuthProvider } = require("@twurple/auth");

const cheerio = require("cheerio");
const axios = require("axios");

let twitchClient;

function initTwitchClient() {

	if(twitchClient) return twitchClient;

	if(!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
		throw new Error("Identifiant ou secret twitch manquant");
	}

	const authProvider = new ClientCredentialsAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);

	twitchClient = new ApiClient({ authProvider });

	return twitchClient;
}

async function isStreamLive(username) {

	const user = await getUserInfos(username);

	if(!user) 
		return false;

	return await getStreamByUserId(user.id) !== null;
}

async function getStreamByUserId(id) {
	return await twitchClient.streams.getStreamByUserId(id);
}

async function getStreamByUserName(username) {
	return await twitchClient.streams.getStreamByUserName(username);
}

async function getUserInfos(username) {
	const user = await twitchClient.users.getUserByName(username);

	if (!user) {
		return undefined;
	}

	return user;
}

async function getVideoById(id) {
	
	const video = await twitchClient.videos.getVideoById(id);

	if (!video) {
		return undefined;
	}

	return video;
}

function getTwitchUsernameFromURL(url) {
	return url.replace("https://www.twitch.tv/", "");
}

function getTwitchVideoIdFromURL(url) {
	return url.replace("https://www.twitch.tv/videos/", "");
}

async function getProtectedVodM3U(id) {
	const response = await axios.default.get(`https://vod.544146.workers.dev/${id}`);

	if(response.status !== 200) {
		return undefined;
	}

	const $ = cheerio.load(response.data);

	const link = $("a").attr("href");

	if(!link) {
		return undefined;
	}

	return link;
}

module.exports = {
	initTwitchClient,
	isStreamLive,
	getUserInfos,
	getTwitchUsernameFromURL,
	getTwitchVideoIdFromURL,
	getStreamByUserId,
	getStreamByUserName,
	getVideoById,
	getProtectedVodM3U
};
const {  getTwitchUsernameFromURL, initTwitchClient, isStreamLive, getStreamByUserName } = require("../../../../services/twitch");

async function getInfosFromURL(url) {

	initTwitchClient();

	const username = getTwitchUsernameFromURL(url);

	if(!await isStreamLive(username)) {
		throw new Error("Cette chaine n'est pas en live.");
	}

	const stream = await getStreamByUserName(username);

	return {
		title: stream.title,
		author: stream.userDisplayName,
		url,
		cover: stream.thumbnailUrl.replace("{width}", "470").replace("{height}", "265")
	};
}

module.exports = {
	getInfosFromURL
};
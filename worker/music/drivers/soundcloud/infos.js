const { SoundCloud } = require("scdl-core");

async function getInfosFromURL(url) {
	await SoundCloud.connect();

	let allInfos;

	try {
		allInfos = await SoundCloud.tracks.getTrack(url);
	}
	catch(error) {
		throw new Error("Ce lien n'est pas un titre Soundcloud.");
	}

	if(allInfos.kind !== "track") {
		throw new Error("Ce lien n'est pas un titre Soundcloud.");
	}

	return {
		title: allInfos.title ?? "",
		author: allInfos.user.username ?? "",
		url: url,
		cover: allInfos.artwork_url ?? ""
	};
}

module.exports = {
	getInfosFromURL
};
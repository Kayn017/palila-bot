const scdl = require("soundcloud-downloader");


async function getInfosFromURL(url) {
	const allInfos = await scdl.default.getInfo(url);

	return {
		title: allInfos.title ?? "test",
		author: allInfos.user?.username ?? "test",
		url: url,
		cover: allInfos.artwork_url ?? "test"
	};
}

module.exports = {
	getInfosFromURL
};
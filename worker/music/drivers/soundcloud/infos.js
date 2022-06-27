const scdl = require("soundcloud-downloader");


async function getInfosFromURL(url) {
	const allInfos = await scdl.default.getInfo(url);

	return {
		title: allInfos.title ?? "",
		author: allInfos.user?.username ?? "",
		url: url,
		cover: allInfos.artwork_url ?? ""
	};
}

module.exports = {
	getInfosFromURL
};
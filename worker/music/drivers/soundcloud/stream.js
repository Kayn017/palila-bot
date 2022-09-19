const { SoundCloud } = require("scdl-core");

/**
 * 
 * @param {string} url 
 * @returns {ReadableStream}
 */
async function getReadableStream(url) {
	await SoundCloud.connect();
	const stream = await SoundCloud.download(url);

	stream.on("close", () => {
		console.log("Coucou");
	});

	return stream;
}

module.exports = {
	getReadableStream
};
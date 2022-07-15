const Ffmpeg = require("fluent-ffmpeg");
const twitch = require("twitch-m3u8");
const { getProtectedVodM3U } = require("../../../../services/twitch");
const { err } = require("../../../../services/log");

/**
 * 
 * @param {string} url 
 * @returns {ReadableStream}
 */
async function getReadableStream(url) {
	const id = url.replace("https://www.twitch.tv/videos/", "");
	
	let m3u8s;
	let audiom3u8;

	try {
		m3u8s = await twitch.getVod(id);
		audiom3u8 = m3u8s.find(stream => stream.resolution === null)?.url;
	}
	catch(error) {
		if(error.message === "Twitch returned status code 403") {
			audiom3u8 = await getProtectedVodM3U(id);
		}

		if(!audiom3u8) {
			err(error, "twitch vod", null, error.stack);
			return undefined;
		}
	}

	const command = Ffmpeg(audiom3u8).noVideo().audioCodec("opus").format("ogg").outputOptions([
		"-drop_pkts_on_overflow", "1", 
		"-attempt_recovery", "1", 
		"-recovery_wait_time", "1", 
		"-recover_any_error", "1"
	]);
	const stream = command.pipe();

	stream.on("close", () => {
		command.on("error", () => {});

		command.kill();
	});

	return stream;
}

module.exports = {
	getReadableStream
};
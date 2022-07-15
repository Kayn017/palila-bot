const Ffmpeg = require("fluent-ffmpeg");
const twitch = require("twitch-m3u8");
const { err, debug } = require("../../../../services/log");

/**
 * 
 * @param {string} url 
 * @returns {ReadableStream}
 */
async function getReadableStream(url) {
	const id = url.replace("https://www.twitch.tv/", "");
	const m3u8s = await twitch.getStream(id);

	const audiom3u8 = m3u8s.find(stream => stream.resolution === null);

	const command = Ffmpeg({
		source: audiom3u8.url,
		stdoutLines: 0
	})
		.noVideo()
		.audioCodec("opus")
		.format("ogg")
		.on("start", cmd => {
			debug(`Starting command "${cmd}"`, "ffmpeg");
		})
		.on("error", (error, stdOut, stdErr) => {
			err(error, "ffmpeg", undefined, error.stack);
			console.error(" ********** STDOUT ********** ");
			err(stdOut, "ffmpeg");
			console.error(" ********** STDERR ********** ");
			err(stdErr, "ffmpeg");
		})
		.on("end", () => {
			debug("Finish !", "ffmpeg");
		})
		.outputOptions([
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
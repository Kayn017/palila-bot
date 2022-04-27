const { getInfosFromURL } = require("./infos");
const { getReadableStream } = require("./stream");
const { triggerByURL } = require("./trigger");

module.exports = {
	getReadableStream,

	triggerByURL,

	getInfosFromURL
};
const os = require("os");

const FILE_LINE_BREAK = os.platform() === "win32" ? "\r\n" : "\n";

module.exports = {
	FILE_LINE_BREAK
};
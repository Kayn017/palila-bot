const fs = require("fs");
const path = require("path");

function init() {

}
function shutdown() {

}
async function execute(request, response, next) {

	const guildId = request.params.guild_id;
	const channelId = request.params.channel_id;
	const archiveName = request.params.archive_name;

	const archivePath = path.join(
		__dirname,
		"..",
		"..",
		"files",
		guildId,
		channelId,
		archiveName
	);

	if(!fs.existsSync(archivePath))
	{
		const error = new Error("Archive not found");
		error.code = 404;
		return next(error);
	}
	
	return response.download(archivePath);
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

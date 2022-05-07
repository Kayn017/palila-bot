const path = require("path");
const fs = require("fs");

async function GET(request, response, next) {
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
module.exports = {
	GET,
};

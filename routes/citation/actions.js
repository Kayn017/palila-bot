const fs = require("fs");
const mime = require("mime-types");

async function GET(request, response, next) {
	const citationId = request.params.citationId;

	if(!citationId) {
		const error = new Error("No id provided");
		error.code = 400;
		return next(error);
	}

	const citation = await request.app.client.db.Citation.findByPk(citationId);

	if(!citation) {
		const error = new Error("Citation not found");
		error.code = 404;
		return next(error);
	}

	response.setHeader("Content-Type", mime.lookup(citation.fileLocation));
	response.setHeader("Content-Length", fs.statSync().size);
	response.sendFile(citation.fileLocation);
}
module.exports = {
	GET,
};

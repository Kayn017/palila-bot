const fs = require("fs");
const path = require("path");

function getTemplate(name) {
	return fs.readFileSync(
		path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"templates",
			`${name}.template`
		)
	).toString();
}

function getJsonTemplate(name) {
	return JSON.parse(
		fs.readFileSync(
			path.join(
				// eslint-disable-next-line no-undef
				__dirname,
				"..",
				"templates",
				`${name}.json`
			)
		)
	);
}

module.exports = {
	getTemplate,
	getJsonTemplate
};
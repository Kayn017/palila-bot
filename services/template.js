const fs = require("fs");
const path = require("path");
const os = require("os");
const { FILE_LINE_BREAK } = require("../services/string");

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

function createFromJSONTemplate(location, structure, options) {

	for (const [filename, content] of Object.entries(structure)) {
		if (!filename.endsWith(".js")) {
			fs.mkdirSync(path.join(location, filename));
			fs.appendFileSync(path.join(location, filename, ".gitkeep"), ".gitkeep");
			createFromJSONTemplate(path.join(location, filename), content, options);
			continue;
		}

		let functions = "";
		let exports = "module.exports = {" + FILE_LINE_BREAK;

		for (const [property, type] of Object.entries(content)) {
			if (type.includes("function")) {
				functions += `${type} ${property}() {${FILE_LINE_BREAK}${FILE_LINE_BREAK}}${FILE_LINE_BREAK}`;
				exports += `\t${property},${FILE_LINE_BREAK}`;
			}
			else {
				let value = "\"\"";

				if (type === "value") {
					if (property === "name") {
						value = "\"" + options.name + "\"";
					}
					else if (property === "author") {
						value = "\"" + os.userInfo().username + "\"";
					}
				}
				else if (type === "array") {
					value = "[]";
				} 
				else if (type === "object") {
					value = "{}";
				}
				else if (type === "boolean") {
					value = "false";
				}

				exports += `\t${property}: ${value},${FILE_LINE_BREAK}`;
			}
		}

		exports += `};${FILE_LINE_BREAK}`;
		fs.writeFileSync(path.join(location, filename), functions.concat(exports));
	}

}

module.exports = {
	getTemplate,
	getJsonTemplate,
	createFromJSONTemplate
};
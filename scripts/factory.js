/* eslint-disable indent */
const fs = require("fs");
const process = require("process");
const path = require("path");
const os = require("os");

const { FILE_LINE_BREAK } = require("../services/string");
const { getTemplate, getJsonTemplate } = require("../services/template");


if (!process.argv[2])
	return console.log("\x1b[31mVeuillez préciser un type d'élement à créer.\x1b[0m");

// MODEL, COMMAND or MODULE
const type = process.argv[2];

if (!process.argv[3])
	return console.log("\x1b[31mVeuillez préciser un nom.\x1b[0m");

const factory = {
	MODEL() {
		const name = process.argv[3];
		const modelPath = path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"models",
			`${name}.js`
		);

		if (fs.existsSync(modelPath)) {
			console.log("\x1b[31mCe modèle existe déjà.\x1b[0m");
			process.exit(1);
		}

		let template = getTemplate("model");
		template = template.replaceAll("{{name}}", name);

		fs.writeFileSync(modelPath, template);

		console.log("\x1b[0m - Modèle créé !\x1b[0m");
	},
	COMMAND() {
		const commandpath = path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"commands",
			process.argv.slice(3).join(path.sep + "subcommands" + path.sep)
		);

		const commandName = process.argv[process.argv.length - 1];

		if (fs.existsSync(commandpath)) {
			console.log("\x1b[31mCette commande existe déjà.\x1b[0m");
			process.exit(1);
		}

		fs.mkdirSync(commandpath);

		const template = getJsonTemplate("command.structure");

		for (const [filename, content] of Object.entries(template)) {
			if (!filename.endsWith(".js")) {
				fs.mkdirSync(path.join(commandpath, filename));
				fs.appendFileSync(path.join(commandpath, filename, ".gitkeep"), ".gitkeep");
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
							value = "\"" + commandName + "\"";
						}
						else if (property === "author") {
							value = "\"" + os.userInfo().username + "\"";
						}
					}
					else if (type === "array") {
						value = "[]";
					} else if (type === "object") {
						value = "{}";
					}

					exports += `\t${property}: ${value},${FILE_LINE_BREAK}`;
				}
			}

			exports += `};${FILE_LINE_BREAK}`;
			fs.writeFileSync(path.join(commandpath, filename), functions.concat(exports));
		}

		const index = getTemplate("index.command");
		fs.writeFileSync(path.join(commandpath, "index.js"), index);

		console.log("\x1b[0m - Commande créée !\x1b[0m");
	},
	MODULE() {
		const modulePath = path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"modules",
			process.argv[3]
		);

		const moduleName = process.argv[3];

		if (fs.existsSync(modulePath)) {
			console.log("\x1b[31mCe module existe déjà.\x1b[0m");
			process.exit(1);
		}

		fs.mkdirSync(modulePath);

		const template = getJsonTemplate("module.structure");

		for (const [filename, content] of Object.entries(template)) {
			if (!filename.endsWith(".js")) {
				fs.mkdirSync(path.join(modulePath, filename));
				fs.appendFileSync(path.join(modulePath, filename, ".gitkeep"), ".gitkeep");
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
							value = "\"" + moduleName + "\"";
						}
						else if (property === "author") {
							value = "\"" + os.userInfo().username + "\"";
						}
					}
					else if (type === "array") {
						value = "[]";
					} else if (type === "object") {
						value = "{}";
					}

					exports += `\t${property}: ${value},${FILE_LINE_BREAK}`;
				}
			}

			exports += `};${FILE_LINE_BREAK}`;
			fs.writeFileSync(path.join(modulePath, filename), functions.concat(exports));
		}

		const index = getTemplate("index.module");
		fs.writeFileSync(path.join(modulePath, "index.js"), index);

		console.log("\x1b[0m - Module créé !\x1b[0m");
	},
	ROUTE() {
		const routePath = path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"routes",
			process.argv[3]
		);

		const moduleName = process.argv[3];

		if (fs.existsSync(routePath)) {
			console.log("\x1b[31mCette route existe déjà.\x1b[0m");
			process.exit(1);
		}

		fs.mkdirSync(routePath);

		const template = getJsonTemplate("route.structure");

		for (const [filename, content] of Object.entries(template)) {
			if (!filename.endsWith(".js")) {
				fs.mkdirSync(path.join(routePath, filename));
				fs.appendFileSync(path.join(routePath, filename, ".gitkeep"), ".gitkeep");
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
							value = "\"" + moduleName + "\"";
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
			fs.writeFileSync(path.join(routePath, filename), functions.concat(exports));
		}

		const index = getTemplate("index.route");
		fs.writeFileSync(path.join(routePath, "index.js"), index);

		console.log("\x1b[0m - Route créé !\x1b[0m");
	}
};

if (!Object.keys(factory).includes(type))
	return console.log("\x1b[31mType inconnu...\x1b[0m");

factory[type]();

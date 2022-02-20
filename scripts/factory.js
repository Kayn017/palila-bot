/* eslint-disable indent */
const fs = require("fs");
const process = require("process");
const path = require("path");

const { getTemplate, getJsonTemplate, createFromJSONTemplate } = require("../services/template");

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

		createFromJSONTemplate(commandpath, template, { name: commandName });

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

		createFromJSONTemplate(modulePath, template, { name: moduleName });
		
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

		const routeName = process.argv[3];

		if (fs.existsSync(routePath)) {
			console.log("\x1b[31mCette route existe déjà.\x1b[0m");
			process.exit(1);
		}

		fs.mkdirSync(routePath);

		const template = getJsonTemplate("route.structure");

		createFromJSONTemplate(routePath , template, { name: routeName });		

		const index = getTemplate("index.route");
		fs.writeFileSync(path.join(routePath, "index.js"), index);

		console.log("\x1b[0m - Route créé !\x1b[0m");
	},
	WORKER() {
		const workerPath = path.join(
			// eslint-disable-next-line no-undef
			__dirname,
			"..",
			"worker",
			process.argv[3]
		);

		const workerName = process.argv[3];

		if (fs.existsSync(workerPath)) {
			console.log("\x1b[31mCe worker existe déjà.\x1b[0m");
			process.exit(1);
		}

		fs.mkdirSync(workerPath);

		const template = getJsonTemplate("worker.structure");

		createFromJSONTemplate(workerPath , template, { name: workerName });		

		const index = getTemplate("index.worker");
		fs.writeFileSync(path.join(workerPath, "index.js"), index);

		console.log("\x1b[0m - Worker créé !\x1b[0m");
	}
};

if (!Object.keys(factory).includes(type))
	return console.log("\x1b[31mType inconnu...\x1b[0m");

factory[type]();

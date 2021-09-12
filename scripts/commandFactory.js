const fs = require("fs");
const process = require("process");
const path = require("path");

if (!process.argv[2])
	return console.log("\x1b[31mVeuillez préciser un nom de commande.\x1b[0m");

const name = process.argv[2];

let template = fs.readFileSync(
	path.join(
		// eslint-disable-next-line no-undef
		__dirname,
		"..",
		"templates",
		"command.template"
	)
);

template = template.toString().replaceAll("{{name}}", name);

fs.writeFileSync(
	path.join(
		// eslint-disable-next-line no-undef
		__dirname,
		"..",
		"commands",
		`${name}.js`
	),
	template
);

console.log(`\x1b[0m - Création de la commande ${name} \x1b[32mréussie !\x1b[0m`);
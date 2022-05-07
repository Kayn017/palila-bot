const { Router } = require("express");
const fs = require("fs");
const path = require("path");

function getRouterFromPath(routesPath, parentRoute = undefined ) {

	const routesFiles = fs.readdirSync(routesPath).filter(f => fs.lstatSync(path.join(routesPath, f)).isDirectory());

	const mainRouter = Router();

	for(const filename of routesFiles) {

		const route = require(path.join(
			routesPath,
			filename
		));

		const fileRouter = Router();

		for(const method of Object.keys(route.actions)) {

			if(!route.stack) route.stack = {};

			route.stack[method] = parentRoute?.stack[method] ? [	...parentRoute.stack[method], route.actions[method] ] : [route.actions[method]];
			
			fileRouter[method.toLowerCase()](route.url, route.stack[method]);
		}

		if(fs.existsSync(path.join(routesPath, filename,	"routes"))) {
			const subRouter = getRouterFromPath(path.join(
				routesPath,
				filename,
				"routes"
			), route);

			fileRouter.use(route.url, subRouter);
		}

		mainRouter.use(fileRouter);
	}

	return mainRouter;
}

module.exports = app => {

	const routePath = path.join(
		__dirname,
		"..",
		"..",
		"routes"
	);

	const mainRouter = getRouterFromPath(routePath);

	app.use(mainRouter);

	// 404 handling
	app.use("*", function (req, res) {
		res.status(404).send("Route not found");
	});

	// obligé de désactiver eslint ici
	// express ne détecte pas le middleware d'erreur s'il y a - de 4 paramètres a la fonction
	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		res.status(err.code ?? 500).send(err.message);
	});

	app.router = mainRouter;
};
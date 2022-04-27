const fs = require("fs");
const path = require("path");

module.exports = app => {

	const routePath = path.join(
		// eslint-disable-next-line no-undef
		__dirname,
		"..",
		"..",
		"routes"
	);

	const routes = [];

	fs.readdirSync(routePath)
		.map(filename => {
			const route = require(path.join(
				routePath,
				filename
			));
			if(route.useMiddleware)
				app.use(route.url, route.middleware);
			return route;
		})
		.forEach(route => {
			app[route.method](route.url, route.execute);
			routes.push(route);
		});

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

	app.routes = routes;
};

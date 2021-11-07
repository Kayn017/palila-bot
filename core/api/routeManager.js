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
	app.get("*", function (req, res) {
		res.status(404).send("Route not found");
	});

	app.routes = routes;
};

const express = require("express");
const { log } = require("../../services/log");
const handleApiErrors = require("./apiError");
const process = require("process");

function initApi(client) {
	const app = express();
	const port = process.env.API_PORT ?? 3000;
	
	app.client = client;

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	
	const routes = require("./routeManager");
	routes(app);
	
	handleApiErrors(app);
	
	app.listen(port, () => {
		log(`Serveur http en écoute sur le port ${port}.`, "api");
	});

	return app;
}


module.exports = initApi;
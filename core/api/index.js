const express = require("express");
const { log } = require("../../services/log");
const handleApiErrors = require("./apiError");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const routes = require("./routeManager");
routes(app);

handleApiErrors(app);

app.listen(80, () => {
	log("Serveur http en écoute sur le port 80.", "api");
});
module.exports = app;
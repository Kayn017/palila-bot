const { err } = require("../../services/log");

function handleApiErrors(app) {
	app.use((e, res) => {
		err(e.message, "api", null, e.stack);
		res.status(e.code ?? 500).send(e.message);
	});
}

module.exports = handleApiErrors;
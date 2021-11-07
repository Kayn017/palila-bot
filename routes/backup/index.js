const { method, url } = require("./infos");
const { execute, middleware, init, shutdown } = require("./actions");

module.exports = {
	method,
	url,
	execute,
	middleware,
	init,
	shutdown
};
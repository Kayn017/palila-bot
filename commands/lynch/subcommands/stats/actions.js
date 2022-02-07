const path = require("path");
const fs = require("fs");
const { getRandomInt } = require("../../../../services/numbers");

function init() {

}
function shutdown() {

}
async function execute(interaction) {

	const stats = fs.readdirSync(path.join(__dirname, "stats"));

	const stat = require(
		path.join(
			__dirname, 
			"stats", 
			stats[getRandomInt(stats.length)]
		));

	stat.execute(interaction);
}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

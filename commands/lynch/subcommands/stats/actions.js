const path = require("path");
const fs = require("fs");
const { getRandomInt } = require("../../../../services/numbers");

const stats = fs.readdirSync(path.join(__dirname, "stats"));

function init() {
	stats.forEach( s => this.options.find(o => o.name === "stat").choices.push(
		{ 
			value: s, 
			name: s.replace(".js", "") 
		}
	));
}
function shutdown() {

}
async function execute(interaction, options) {

	interaction.target = options.find(o => o.name === "personne")?.user ?? interaction.user;
	
	const statOption = options.find(o => o.name === "stat")?.value;

	const stat = require(
		path.join(
			__dirname, 
			"stats", 
			statOption ?? stats[getRandomInt(stats.length)]
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

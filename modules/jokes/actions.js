const { getRandomInt } = require("../../services/numbers");
const jokes = require("./jokes.json");

const MESSAGE_LENGTH = 2000; 

function init(client) {

	const triggers = Object.keys(jokes).map( k => { 
		return { 
			id: k, 
			regexp: new RegExp(k, "im") 
		}; 
	});

	client.on("messageCreate", msg => {

		if(msg.author.bot) return;

		triggers.forEach( t => {
			if(t.regexp.test(msg.content)) {

				let retour = jokes[t.id][getRandomInt(jokes[t.id].length)];
				// const templateLength = retour.replaceAll(/{{[^ ]+}}/g, "").length;

				retour = retour.replaceAll("{{bot}}", msg.client.user.username);
				retour = retour.replaceAll("{{author}}", msg.author.username);
				retour = retour.replaceAll("{{captured}}", msg.content.match(t.regexp)[1].substring(0, MESSAGE_LENGTH - retour.replaceAll("{{captured}}", "").length));

				msg.reply( retour );
			}
		});

	});

}
function shutdown() {

}
async function configure() {

}
module.exports = {
	init,
	shutdown,
	configure,
};

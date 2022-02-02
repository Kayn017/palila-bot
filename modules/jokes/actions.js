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

				let joke = jokes[t.id][getRandomInt(jokes[t.id].length)];
				// const templateLength = joke.replaceAll(/{{[^ ]+}}/g, "").length;

				if(joke.includes("{{bot}}"))
					joke = joke.replaceAll("{{bot}}", msg.client.user.username);
				if(joke.includes("{{author}}"))
					joke = joke.replaceAll("{{author}}", msg.author.username);
				if(joke.includes("{{captured}}"))
					joke = joke.replaceAll("{{captured}}", msg.content.match(t.regexp)[1]?.substring(0, MESSAGE_LENGTH - joke.replaceAll("{{captured}}", "").length));

				msg.reply( joke );
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

const process = require("process");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const { fatalError } = require("../services/log");

function handleError(client) {

	process.on("uncaughtException", async (err) => {

		fatalError(`FATAL : ${err.message}`, "error", undefined, err.stack);

		if (client.isReady()) {

			const config = JSON.parse(fs.readFileSync("./config/config.json"));

			for (const userID of config.discord.gods) {
				const user = await client.users.fetch(userID);

				const errorMessage = new MessageEmbed();
				errorMessage.setTitle("FATAL ERROR");
				errorMessage.addField("Message", err.message);
				errorMessage.addField("Stack", err.stack ?? "Pas de stack");
				errorMessage.setColor("RED");

				user.send({ embeds: [errorMessage] });
			}
		}
	});
}

module.exports = {
	handleError
};
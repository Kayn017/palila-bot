const process = require("process");
const { EmbedBuilder } = require("discord.js");
const { fatalError } = require("../../services/log");

function handleError(client) {
	process.on("uncaughtException", async (err) => {
		fatalError(`FATAL : ${err.message}`, "error", undefined, err.stack);

		if (client.isReady() && !global.devEnv) {
			const gods = await client.db.User.findAll({ where: { god: true } });

			for (const god of gods) {
				const user = await client.users.fetch(god.discordid);

				const errorMessage = new EmbedBuilder();
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
	handleError,
};

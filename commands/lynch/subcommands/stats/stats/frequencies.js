const { MessageEmbed } = require("discord.js");
const process = require("process");

module.exports = {
	async execute(interaction) {

		const history = await interaction.client.db.LynchHistory.findAll();

		const frequencies = {};

		history.forEach(history => frequencies[history.number] ? frequencies[history.number]++ : frequencies[history.number] = 1);

		let response = new MessageEmbed()
			.setTitle("Fréquence des nombres")
			.setColor(process.env.COLOR);		

		let body = "";

		for(const [key, value] of Object.entries(frequencies)) {
			body += `${key} : ${value}\n`;
		}

		response = response.addField("Fréquence", body);

		interaction.reply({ embeds: [response], ephemeral: true });
	}
};
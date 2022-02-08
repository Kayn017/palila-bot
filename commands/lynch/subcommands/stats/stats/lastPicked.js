const { MessageEmbed } = require("discord.js");
const process = require("process");

module.exports = {
	async execute(interaction) {

		const history = await interaction.client.db.LynchHistory.findAll({
			order: [
				[ "createdAt", "DESC" ]
			]
		});

		const res = {};

		for(const entry of history) {
			if(res[entry.number]) 
				continue;

			res[entry.number] = entry.createdAt;
		}
		
		let response = new MessageEmbed()
			.setColor(process.env.COLOR)
			.setTitle("Durée depuis le dernier tirage");

		let body = "";

		for(const [key, value] of Object.entries(res)) {

			const duration = Date.now() - value;
			const durationDays = duration / (24 * 60 * 60 * 1000);

			body += `${key} : ${Math.floor(durationDays)} jours\n`;
		}

		response = response.addField("Jours", body);

		interaction.reply({ embeds: [response] });
	}
};
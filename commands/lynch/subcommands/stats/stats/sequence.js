module.exports = {
	async execute(interaction) {

		const history = await interaction.client.db.LynchHistory.findAll();

		const sequence = history.map(h => h.number).join("-");

		interaction.reply({ content: "La séquence actuellement est \n```" + sequence + "```", ephemeral: true });
	}
};
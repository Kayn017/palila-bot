module.exports = {
	async execute(interaction) {

		const score = await interaction.client.db.LynchScore.findOne({
			where: {
				UserDiscordid: interaction.target.id
			}
		});

		if(!score) {
			interaction.reply({ 
				content: `${interaction.target.id === interaction.user.id ? "Vous n'avez" : `${interaction.target.username} n'a` } jamais joué à la loterie encore :(`
			});
		}
		else {
			interaction.reply({ 
				content: `Avec ${score.points} points et ${score.voteHistory.length} jours joué, ${ interaction.target.id === interaction.user.id ? " vous avez un ratio de " : `${interaction.target.username} a un ratio de ` } ${(score.points / score.voteHistory.length)}`, 
			});
		}
	}
};
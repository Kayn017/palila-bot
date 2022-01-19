function init() {

}
function shutdown() {

}
async function execute(interaction, options) {

	const user = options ? options[0].user : interaction.user;
	const guildId = interaction.guild.id; 

	const lynchScore = await interaction.client.db.LynchScore.findOne({
		where: {
			guildId,
			UserDiscordid: user.id
		}
	});

	if(!lynchScore) {

		const message = user.id === interaction.user.id ? 
			"Vous n'avez encore jamais joué à la loterie sur ce serveur !" :
			`${user.tag} n'a encore jamais joué à la loterie sur ce serveur !`;

		return interaction.reply({ content: message });
	}

	const message = user.id === interaction.user.id ? 
		`Vous avez **${lynchScore.points}** point${ lynchScore.points > 1 ? "s" : "" } !` :
		`${user.tag} a **${lynchScore.points}** point${ lynchScore.points > 1 ? "s" : "" } !`;

	return interaction.reply({ content: message });

}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

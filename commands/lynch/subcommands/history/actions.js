const { MessageEmbed } = require("discord.js");

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

	const lynchHistory = await interaction.client.db.LynchHistory.findAll({
		order: [[ "createdAt", "DESC" ]],
		limit: 10
	});

	const tenLastVotes = lynchScore.voteHistory.slice(Math.max( lynchScore.voteHistory.length - 10, 0));

	const embed = new MessageEmbed()
		.setTitle(user.id === interaction.user.id ? "Vos 10 derniers votes" : `Les 10 derniers votes de ${user.username}`)
		.setColor(process.env.COLOR);

	let nbWins = 0; 

	for(let i = 0; i < 10 && i < tenLastVotes.length && i < lynchHistory.length; i++) {

		embed.addField("" + tenLastVotes[i], lynchHistory[i].number === tenLastVotes[i] ? "*Gagnant*" : "Perdant");

		if(lynchHistory[i].number === tenLastVotes[i])
			nbWins++;
	}

	embed.setFooter({ text: `Cela fait ${nbWins} bon${nbWins > 1 ? "s" : ""} numéro${nbWins > 1 ? "s" : ""} ces dix derniers jours` });

	return interaction.reply({ embeds: [embed] });

}
async function middleware() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

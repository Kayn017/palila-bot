const Discord = require("discord.js");
const process = require("process");
const { stringToMs } = require("../../services/time");
const color = process.env.COLOR;
const { LocalCache } = require("../../services/cache");
const { debug } = require("../../services/log");
const { DEFAULT_DURATION } = require("./consts");

const cache = LocalCache.get("poll");

async function init(client) {
	for (const [key, value] of cache.getAllDataEntries()) {
		// on récupère le message du sondage
		let channel;
		let pollMessage;

		try {
			channel = await client.channels.fetch(value.channel);
			pollMessage = await channel.messages.fetch(key);
		} catch (e) {
			debug(`Suppression de la valeur ${key} du cache : le message n'existe plus.`, "poll", undefined, e.stack);
			cache.delete(key);
			continue;
		}

		const timeLeft = value.endDate - Date.now();

		if (timeLeft > 0) collectVotes(pollMessage, timeLeft);
		else sendResults(pollMessage);
	}
}

function shutdown() {

}

async function execute(interaction, options) {
	// récuperation des options
	const title = options.find((o) => o.name === "intitule").value;

	const choice1 = options.find((o) => o.name === "choix1").value;
	const choice2 = options.find((o) => o.name === "choix2").value;

	const choice3 = options.find((o) => o.name === "choix3")?.value;
	const choice4 = options.find((o) => o.name === "choix4")?.value;
	const choice5 = options.find((o) => o.name === "choix5")?.value;

	const duration = options.find((o) => o.name === "duree")?.value;

	// préparation du temps restants du sondage
	let pollDuration = DEFAULT_DURATION;

	if (duration) {
		try {
			pollDuration = stringToMs(duration);
		} catch (err) {
			return interaction.reply({
				content: "Le format de la date est invalide. Elle doit être au format `<nombre><j ou h ou m ou s>`.\nExemple : `10j` pour 10 jours, `30m` pour 30 minutes.",
				ephemeral: true,
			});
		}
	}

	// préparation du message
	const endDate = new Date(Date.now() + pollDuration);
	const endDateString = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()} à ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;

	const embed = new Discord.MessageEmbed();

	embed.setTitle(title);
	embed.setAuthor(interaction.user.username, interaction.user.avatarURL());
	embed.setColor(color);
	embed.setDescription("Votez sur les boutons ci-dessous !");
	embed.addField("Date de fin du sondage", endDateString);

	// préparation des boutons
	const row = new Discord.MessageActionRow();

	row.addComponents(
		new Discord.MessageButton()
			.setCustomId(choice1)
			.setLabel(`${choice1} : 0`)
			.setStyle("PRIMARY"),
		new Discord.MessageButton()
			.setCustomId(choice2)
			.setLabel(`${choice2} : 0`)
			.setStyle("PRIMARY")
	);

	if (choice3)
		row.addComponents(
			new Discord.MessageButton()
				.setCustomId(choice3)
				.setLabel(`${choice3} : 0`)
				.setStyle("PRIMARY")
		);
	if (choice4)
		row.addComponents(
			new Discord.MessageButton()
				.setCustomId(choice4)
				.setLabel(`${choice4} : 0`)
				.setStyle("PRIMARY")
		);
	if (choice5)
		row.addComponents(
			new Discord.MessageButton()
				.setCustomId(choice5)
				.setLabel(`${choice5} : 0`)
				.setStyle("PRIMARY")
		);

	let response;

	// envoie du sondage
	try {
		response = await interaction.reply({
			embeds: [embed],
			components: [row],
			fetchReply: true,
		});
	} catch (e) {
		if (e instanceof Discord.DiscordAPIError)
			return interaction.reply({
				content: "Chaque fois du vote doit être unique.",
				ephemeral: true,
			});
	}

	// récupération des votes
	const votes = collectVotes(response, pollDuration);

	cache.set(response.id, {
		channel: interaction.channelId,
		votes,
		voters: [], // {id: <id du votant>, choice: <id du choix>}
		endDate: Date.now() + pollDuration,
	});
}

async function middleware() {

}

function collectVotes(voteMessage, pollDuration) {
	const votes = cache.get(voteMessage.id)?.votes ?? {};

	const filter = (interaction) => interaction.isButton();

	const collector = voteMessage.createMessageComponentCollector({
		filter,
		time: pollDuration,
		dispose: true,
	});

	collector.on("collect", (i) => {
		const res = updateVote(voteMessage.id, i.user.id, i.customId);

		if (!res)
			return i.reply({
				content: `Vous avez déjà voté \`${i.customId}\``,
				ephemeral: true,
			});

		for (const component of i.message.components[0].components) 
			component.setLabel(`${component.customId} : ${votes[component.customId] ?? 0}`);
		

		i.update({ components: i.message.components });
	});

	collector.on("end", () => {
		sendResults(voteMessage);
	});

	return votes;
}

function updateVote(pollID, voterID, vote) {
	const infos = cache.get(pollID);

	const voter = infos.voters.find((v) => v.id === voterID);

	if (!voter) {
		infos.votes[vote] ? infos.votes[vote]++ : (infos.votes[vote] = 1);

		infos.voters.push({ id: voterID, choice: vote });

		cache.set(pollID, infos);

		return true;
	} 
	else if (voter.choice !== vote) {
		infos.votes[voter.choice]--;
		infos.votes[vote] ? infos.votes[vote]++ : (infos.votes[vote] = 1);

		const voterIndex = infos.voters.findIndex((v) => v.id === voterID);

		infos.voters[voterIndex] = { id: voterID, choice: vote };

		cache.set(pollID, infos);

		return true;
	}

	return false;
}

function sendResults(voteMessage) {
	const votes = cache.get(voteMessage.id)?.votes ?? {};

	const embed = new Discord.MessageEmbed();

	embed.setColor(color);
	embed.setTitle(`Résultat du sondage : ${voteMessage.embeds[0].title}`);
	embed.setAuthor(
		voteMessage.interaction.user.username,
		voteMessage.interaction.user.avatarURL()
	);

	for (const button of voteMessage.components[0].components) {
		embed.addField(button.customId, `${votes[button.customId] ?? 0} vote(s)`, true);
	}

	voteMessage.reply({ embeds: [embed] });

	cache.delete(voteMessage.id);
}

module.exports = {
	init,
	shutdown,
	execute,
	middleware,
};

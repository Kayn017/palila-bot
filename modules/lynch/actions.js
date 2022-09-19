const { LocalCache } = require("../../services/cache");
const axios = require("axios");
const process = require("process");
const config = require("../../services/config");
const { err } = require("../../services/log");
const { EmbedBuilder } = require("discord.js");
const { reactWithNumbers } = require("../../services/reaction");
const { emojiToNumber, numberToEmoji } = require("../../services/numbers");
const emojis = require("../../assets/emojis.json");

const cache = LocalCache.get("lynch");

const LYNCH_CHANNEL_ID = "UUDLD_zxiuyh1IMasq9nbjrA";
const NUMBER_OF_ROWS_TO_DISPLAY = 8;

let db;
let todayResult = null;
let allReactionCollectors = [];
let allMessagesCollectors = [];

async function init(client) {

	db = client.db;

	let votesMessages = cache.get("votesMessages");

	if(votesMessages === undefined)
		votesMessages = {};

	for(const [channelId, messageId] of Object.entries(votesMessages)) {

		const channel = await client.channels.fetch(channelId);
		const msg = await channel.messages.fetch(messageId);

		await handleVotes(msg);
	}

	setInterval( async () => {

		let history = cache.get("history");

		if(history === undefined) history = [];

		const videos = await axios({
			method: "GET",
			url: "https://youtube.googleapis.com/youtube/v3/playlistItems",
			params: {
				part: "snippet",
				maxResults: 50,
				key: process.env.YOUTUBE_API_KEY,
				playlistId: LYNCH_CHANNEL_ID
			}
		});

		const newVideos = videos.data.items.filter( video => !history.includes(video.snippet.resourceId.videoId) );

		if(newVideos.length === 0) return;

		newVideos.forEach( async video => {

			const newVideosChannelKeys = await config.getKeys("module", "lynch", "*", "channel");

			newVideosChannelKeys.forEach( async key => {

				const channelId = await client.config.get(key);
				const channel = await client.channels.fetch(channelId);

				sendVideoNotification(channel, video);
			});
			
		});
		
		cache.set("history", videos.data.items.map( video => video.snippet.resourceId.videoId ));

	}, 10 * 1000);
}

async function sendVideoNotification(channel, video) {

	try {
		await channel.send({
			content: `Nouvelle video de David Lynch !\nhttps://youtu.be/${video.snippet.resourceId.videoId}`
		});
	}
	catch(error) {
		err(error, "lynch", { channel, guild: channel.guild }, error.stack);
		return;
	}

	if(video.snippet.title.startsWith("TODAY'S NUMBER IS...")) {
		todayResult = null;

		allReactionCollectors.forEach(rc => rc.stop());
		allReactionCollectors = [];

		allMessagesCollectors.forEach( mc => mc.stop() );
		allMessagesCollectors = [];

		askForResults(channel);
	}
}

async function askForResults(channel) {

	let msg;

	try {
		msg = await channel.send({
			content: "Quel est le numéro du jour ? Envoyez un message avec la réponse, j'ai pas vu la vidéo :eyes:"
		});
	}
	catch(error) {
		err(error, "lynch", { channel, guild: channel.guild }, error.stack);
		return;
	}

	const numberFilter = m => /^[1-9]$|^10$/g.test(m.content);

	const msgCollector = channel.createMessageCollector(numberFilter, { dispose: true });

	msgCollector.on("collect", m => {
		if (todayResult === null)
			todayResult = m.content;

		allMessagesCollectors.forEach( mc => mc.stop() );
	});

	msgCollector.on("end", async () => {

		if(!todayResult)
			return err("Un collector s'est arrêté sans que le résultat ne soit donné.", "lynch", { channel, guild: channel.guild });

		try {
			await updateHistory();
			await updateScore(channel.guild.id);
			await sendRank(channel);
			await cleanVotes(channel.guild.id);	
			await sendVoteMessage(channel);

			await msg.delete();
		}
		catch(error) {
			return err(error, "lynch", msg, error.stack);
		}
	});

	allMessagesCollectors.push(msgCollector);
}


async function updateHistory() {
	await db.LynchHistory.create({ number: todayResult });
}

async function updateScore(guildId) {

	let votes = cache.get("votes");

	if(!votes) {
		votes = {};
		cache.set("votes", votes);
	}
	
	if(!votes[guildId]) {
		votes[guildId] = {};
		cache.set("votes", votes);
	}

	let todayWinners = votes[guildId][todayResult];

	if(!todayWinners) todayWinners = [];

	for(let i = 1; i <= 10; i++) {

		for(const id of votes[guildId][i]) {

			let score = await db.LynchScore.findOne({
				where: {
					guildId,
					UserDiscordid: id
				}
			});

			// si l'utilisateur n'a pas de score en bdd, on lui en créé un
			if(!score) {
				let user = await db.User.findOne({
					where: {
						discordid: id
					}
				});

				// si on n'a jamais enregistré l'utilisateur en bdd, on le fait
				if(!user) {
					user = await db.User.create({ discordid: id, god: false });
				}

				score = await db.LynchScore.create({ guildId, UserDiscordid: id, points: 0, voteHistory: [] });
			}

			if(i == todayResult) {
				score.points++;
			}

			score.voteHistory.push(i);

			// obligé de faire ca pour forcer sequelize a update l'history des votes
			score.changed( "voteHistory", true );
			await score.save();
		}
	}
}

async function sendRank(channel) {
	const scores = await db.LynchScore.findAll({ 
		where: { 
			guildId: channel.guild.id
		} 
	});

	const rankToDisplay = [];
	// example :
	// rankToDisplay = [{ persons: ["11111111"], points: 5 }, { persons: ["00000000","22222222"], points: 2 }, etc... ];

	let maxPoints;
	let minPoints;

	// on trie les personnes dans l'ordre de leur classement (les premiers en premiers, les deuxiemes en deuxiemes, etc)
	for (const score of scores) {

		const member = await channel.guild.members.fetch(score.UserDiscordid);

		if(!member) continue;
		
		const points = score.points;

		if(points === 0) continue;

		if (rankToDisplay.length === 0) {
			rankToDisplay.push({ persons: [member.user.tag], points });
			minPoints = points;
			maxPoints = points;
		}
		else if (points > maxPoints) {
			rankToDisplay.splice(0, 0, { persons: [member.user.tag], points });
			maxPoints = points;
		}
		else if (points === maxPoints) {
			rankToDisplay[0].persons.push(member.user.tag);
		}
		else if (points < minPoints) {
			rankToDisplay.push({ persons: [member.user.tag], points });
			minPoints = points;
		}
		else if (points === minPoints) {
			rankToDisplay[rankToDisplay.length - 1].persons.push(member.user.tag);
		}
		else {
			// dernier rang ou le nombre de points est superieur au nombres de points de la personne
			let latestRank;

			for (const rank of rankToDisplay) {
				if (rank.points === points) {
					rank.persons.push(member.user.tag);
					latestRank = -1;
					break;
				}
				else if (rank.points > points)
					latestRank = rankToDisplay.indexOf(rank);
			}

			if (latestRank !== -1) {
				rankToDisplay.splice(latestRank + 1, 0, { persons: [member.user.tag], points });
			}
		}
	}

	const embed = new EmbedBuilder()
		.setTitle("Classement actuel")
		.addField("Résultat d'aujourd'hui", `Le chiffre du jour est le ${todayResult} !`)
		.setColor(process.env.COLOR)
		.setFooter({ text: "Are you feeling lucky today????" });

	let numberOfPersonsDisplayed = 1;

	for(let i = 0; i < rankToDisplay.length && i < NUMBER_OF_ROWS_TO_DISPLAY; i++) {

		let persons = "";

		rankToDisplay[i].persons.forEach(person => {
			persons = persons === "" ? person : person.concat(`\n${person}`);
		});

		embed.addField(numberOfPersonsDisplayed === 1 ? 
			`1er avec ${rankToDisplay[i].points} points` :
			`${numberOfPersonsDisplayed}e avec ${rankToDisplay[i].points} points`,
		persons);
		
		numberOfPersonsDisplayed += rankToDisplay[i].persons.length;
	}

	await channel.send({
		embeds: [embed]
	});
}

async function cleanVotes(guildId) {
	let votes = cache.get("votes");

	if(!votes) {
		votes = {};
		cache.set("votes", votes);
	}

	votes[guildId] = {};

	for(let i = 1; i <= 10; i++) {
		votes[guildId][i] = [];
	}

	cache.set("votes",votes);
}

async function sendVoteMessage(channel) {

	let msg;

	try {
		msg = await channel.send({
			content: "Quel sera le numéro suivant ? A vos jeux !"
		});
	}
	catch(error) {
		return err(error, "lynch", { channel, guild: channel.guild }, error.stack);
	}

	handleVotes(msg);
}

async function handleVotes(msg) {
	const voteFilter = reaction => {

		let out = false;
		for (let i = 1; i <= 10; i++) {
			out |= reaction.emoji.name === emojis[i];
		}
		return out;
	};

	const reactionCollector = msg.createReactionCollector(voteFilter, { dispose: true });

	const votes = cache.get("votes");
	const usersVotes = votes[msg.channel.guild.id];

	reactionCollector.on("collect", (r, user) => {

		if(user.bot) return;

		if(usersVotes[emojiToNumber(r.emoji.name)].includes(user.id))
			return;

		const oldVote = lastVoteFromUser(usersVotes, user.id);

		if(oldVote) {
			msg.reactions.cache.get(numberToEmoji(oldVote)).users.remove(user.id);
			usersVotes[oldVote].splice(usersVotes[oldVote].indexOf(user.id), 1);
		}

		usersVotes[emojiToNumber(r.emoji.name)].push(user.id);

		votes[msg.channel.guild.id] = usersVotes;
		cache.set("votes", votes);
	});

	// reactionCollector.on("end", collected => {
	// 	console.log(collected);
	// });

	allReactionCollectors.push(reactionCollector);

	const votesMessages = {};

	allReactionCollectors.forEach(c => votesMessages[c.message.channel.id] = c.message.id);

	cache.set("votesMessages", votesMessages);

	reactWithNumbers(msg);
}

function lastVoteFromUser(usersVote, userID) {

	let oldVote = null;

	for (const [key, value] of Object.entries(usersVote)) {
		value.forEach(user => {
			if (user === userID)
				oldVote = key;
		});
	}

	return oldVote;

}

function shutdown() {

}
module.exports = {
	init,
	shutdown,
};

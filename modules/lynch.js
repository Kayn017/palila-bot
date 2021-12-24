const Discord = require('discord.js')
const fs = require('fs');
const rssparser = require("rss-parser");
const parser = new rssparser();
const { reactWithNumbers } = require('../services/reactions')
const emojis = require("../resources/emojis.json")
const number = require("../services/number")

const name = `lynch`
const description = `Module pour la fameuse loterie de David Lynch`

const NUMBER_OF_ROWS_TO_DISPLAY = 8;

let lynchPostedVideos = [];
let allMessageCollectors = [];
let allReactionsCollectors = [];

let todayResult = null;

function init(client) {

	client.on('ready', () => {

		if (!fs.existsSync(`./log/lynch.json`))
			fs.writeFileSync(`./log/lynch.json`, JSON.stringify([]));
		else
			lynchPostedVideos = JSON.parse(fs.readFileSync(`./log/lynch.json`));

		if (!fs.existsSync(`./config/lynch.json`))
			fs.writeFileSync(`./config/lynch.json`, JSON.stringify({}));

		setInterval(() => {
			checkForUpdates(client);
		}, 60 * 1000)
	})
}

async function checkForUpdates(client) {

	const lynchConfig = JSON.parse(fs.readFileSync(`./config/lynch.json`))

	let data;

	try {
		data = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${lynchConfig.channelID}`);
	}
	catch (e) {
		err(`Impossible de récuperer les dernières vidéos.`, null, e)
		return;
	}

	const latestVideo = data.items[0];

	if (lynchPostedVideos.includes(latestVideo.link))
		return;

	if (latestVideo.title.includes(`David Lynch's Weather Report`)) {
		allMessageCollectors.forEach(mc => mc.stop());
		allReactionsCollectors.forEach(rc => rc.stop());
	}

	todayResult = null;

	for (const [guildID, channelID] of Object.entries(lynchConfig.channels)) {

		const configGuild = JSON.parse(fs.readFileSync(`./guilds/${guildID}/config.json`))

		if (!configGuild.lynch)
			continue;

		const guild = await client.guilds.fetch(guildID);

		const channel = guild.channels.cache.find((chan) => chan.id === channelID);

		const lynchNotificationMessage = await channel.send(`Nouvelle vidéo de David Lynch ! \n${latestVideo.link}`).catch(e => err("Impossible d'envoyer un message sur ce channel.", message, e));

		if (!latestVideo.title.includes(`TODAY'S NUMBER IS`))
			continue;

		askForResult(lynchNotificationMessage, lynchConfig.channels);
	}

	lynchPostedVideos.push(latestVideo.link);
	fs.writeFileSync(`./log/lynch.json`, JSON.stringify(lynchPostedVideos));
}



async function askForResult(message, channels) {

	await message.channel.send("Quel est le numéro du jour ?").catch(e => err("Impossible d'envoyer un message sur ce channel.", message, e));

	const numberFilter = m => /^[1-9]$|^10$/g.test(m.content);

	const messageCollector = message.channel.createMessageCollector(numberFilter, { dispose: true })

	messageCollector.on('collect', async m => {
		if (todayResult !== null)
			messageCollector.stop();
		else {

			todayResult = m.content;

			for (const [guildID, channelID] of Object.entries(channels)) {

				const guild = await message.client.guilds.fetch(guildID);

				updateScores(guild, todayResult);
				sendRank(guild, todayResult);
				cleanVotes(guild.id)
			}

			allMessageCollectors.forEach(mc => mc.stop());
		}
	})

	messageCollector.on('end', () => {
		sendVotesMessage(message.channel)
	});

	allMessageCollectors.push(messageCollector);

}

function updateScores(guild, todayResponse) {

	// on collecte les votes de la derniere fois
	let latestVotes;

	if (fs.existsSync(`./guilds/${guild.id}/tempVote.json`))
		latestVotes = JSON.parse(fs.readFileSync(`./guilds/${guild.id}/tempVote.json`));
	else
		return;

	// on collecte les scores de la guild
	let scores = {};

	if (fs.existsSync(`./guilds/${guild.id}/scores.json`))
		scores = JSON.parse(fs.readFileSync(`./guilds/${guild.id}/scores.json`));


	// pour chaque winner, augmenter le nombre de points de 1
	for (const person of latestVotes[todayResponse]) {
		if (scores[person])
			scores[person]++;
		else
			scores[person] = 1;
	}

	fs.writeFileSync(`./guilds/${guild.id}/scores.json`, JSON.stringify(scores));

}

function sendRank(guild, todayResponse) {

	if (!fs.existsSync(`./guilds/${guild.id}/scores.json`))
		return;

	const scores = JSON.parse(fs.readFileSync(`./guilds/${guild.id}/scores.json`));

	const rankToDisplay = [];
	// example :
	// rankToDisplay = [{ persons: ["11111111"], points: 5 }, { persons: ["00000000","22222222"], points: 2 }, etc... ];


	let maxPoints;
	let minPoints;

	// on trie les personnes dans l'ordre de leur classement (les premiers en premiers, les deuxiemes en deuxiemes, etc)
	for (const [personID, points] of Object.entries(scores)) {

		const person = guild.members.cache.get(personID)?.user.tag;

		if(!person) continue;
		
		if (rankToDisplay.length === 0) {
			rankToDisplay.push({ persons: [person], points })
			minPoints = points;
			maxPoints = points;
		}
		else if (points > maxPoints) {
			rankToDisplay.splice(0, 0, { persons: [person], points });
			maxPoints = points;
		}
		else if (points === maxPoints) {
			rankToDisplay[0].persons.push(person);
		}
		else if (points < minPoints) {
			rankToDisplay.push({ persons: [person], points })
			minPoints = points;
		}
		else if (points === minPoints) {
			rankToDisplay[rankToDisplay.length - 1].persons.push(person);
		}
		else {
			// dernier rang ou le nombre de points est superieur au nombres de points de la personne
			let latestRank;

			for (const rank of rankToDisplay) {
				if (rank.points === points) {
					rank.persons.push(person);
					latestRank = -1;
					break;
				}
				else if (rank.points > points)
					latestRank = rankToDisplay.indexOf(rank);
			}

			if (latestRank !== -1) {
				rankToDisplay.splice(latestRank + 1, 0, { persons: [person], points })
			}
		}
	}


	// on prépare du classement a envoyer
	const embed = new Discord.MessageEmbed()
		.setTitle("Classement actuel")
		.addField("Résultat d'aujourd'hui", `Le chiffre du jour est le ${todayResponse} !`)
		.setColor(0x1e80d6)

	let numberOfPersonsDisplayed = 1;

	for (let i = 0; i < rankToDisplay.length && i < NUMBER_OF_ROWS_TO_DISPLAY; i++) {

		let persons = "";

		rankToDisplay[i].persons.forEach(person => {
			persons = persons === "" ? person : `${persons} \n${person}`;
		})

		embed.addField(numberOfPersonsDisplayed === 1 ? `1er avec ${rankToDisplay[i].points} points` : `${numberOfPersonsDisplayed}e avec ${rankToDisplay[i].points} points`, persons);
		numberOfPersonsDisplayed += rankToDisplay[i].persons.length;
	}

	// on envoie ce message sur tout les channels de la guild en question
	const channelsToSend = JSON.parse(fs.readFileSync('./config/lynch.json')).channels;

	const channel = guild.channels.cache.find(chan => chan.id === channelsToSend[guild.id])
	channel.send(embed).catch(e => err(`Impossible d'envoyer un message sur le channel ${channel.name} du serveur ${channel.guild.name}`, null, e))

}

/**
 * 
 * @param {*} usersVote 
 * @param {*} userID 
 * @returns {boolean} true if the user has not yet voted 
 */
function checkUniqueVote(usersVote, userID) {

	let response = true;

	for (const [key, value] of Object.entries(usersVote)) {
		value.forEach(user => {
			if (user === userID)
				response = false;
		})
	}

	return response;

}


async function sendVotesMessage(channel) {

	const responseFilter = reaction => {
		let out = false;
		for (let i = 1; i <= 10; i++) {
			out |= reaction.emoji.name === emojis[i]
		}
		return out;
	};

	const message = await channel.send(`Quel sera le numéro suivant ? A vous de voter !`).catch(e => err("Impossible d'envoyer un message sur ce channel.", message, e));

	reactWithNumbers(message)


	const reactionCollector = message.createReactionCollector(responseFilter, { dispose: true })

	const usersVote = [];

	for (let i = 1; i <= 10; i++) {
		usersVote[i] = [];
	}


	reactionCollector.on('collect', r => {

		r.users.cache.delete(message.author.id)

		r.users.cache.each(user => {

			if (usersVote[number.emojiToNumber(r.emoji.name)].includes(user.id))
				return;

			if (!checkUniqueVote(usersVote, user.id)) {

				r.users.remove(user.id).catch(e => err(`Impossible de supprimer la réaction.`, r.message, e));

				return
			}

			usersVote[number.emojiToNumber(r.emoji.name)].push(user.id)

			fs.writeFileSync(`./guilds/${message.guild.id}/tempVote.json`, JSON.stringify(usersVote))
		})
	});

	reactionCollector.on('remove', r => {
		r.users.cache.delete(message.author.id)

		usersVote[number.emojiToNumber(r.emoji.name)].forEach(user => {

			if (r.users.cache.has(user))
				return;

			usersVote[number.emojiToNumber(r.emoji.name)].splice(usersVote[number.emojiToNumber(r.emoji.name)].indexOf(user), 1);

			fs.writeFileSync(`./guilds/${message.guild.id}/tempVote.json`, JSON.stringify(usersVote))
		})
	})

	allReactionsCollectors.push(reactionCollector);

}

function cleanVotes(guildID) {

	const usersVote = [];

	for (let i = 1; i <= 10; i++) {
		usersVote[i] = [];
	}

	fs.writeFileSync(`./guilds/${guildID}/tempVote.json`, JSON.stringify(usersVote))

}

function log(text, msg) {
	require('../services/log').logStdout(text, name, msg ?? null);
}

function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}

module.exports = { name, description, init };
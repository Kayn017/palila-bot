const Discord = require('discord.js');
const fs = require('fs');

const name = "partiel"

const description = "module de mise en commun des ressources"

let channelCache = {};

function init(client) {

	client.on('message', async message => {

		if (message.author.bot) return;

		const configGlobal = require("../config/partiels_config.json");

		// On vérifie l'existe de partiels_config.json pour ce serveur
		if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('partiels_config.json')) return;

		const configGuild = require(`../guilds/${message.guild.id}/partiels_config.json`);

		// on vérifie si le message a été envoyé dans un channel setup et activé
		if (!configGuild[message.channel.name] || !configGuild[message.channel.name].activated) return;

		// on récupère tout les channels du canal
		let canals = configGlobal[configGuild[message.channel.name].canal];

		//mise en cache si besoin
		if (!channelCache[configGuild[message.channel.name].canal])
			channelCache[configGuild[message.channel.name].canal] = {};

		for (let channelId of canals) {
			if (channelCache[configGuild[message.channel.name].canal][channelId]) continue;

			channelCache[configGuild[message.channel.name].canal][channelId] = await client.channels.fetch(channelId);
		}

		// pour chaque channel du canal, on vérifie s'ils sont activé ou non
		let chanActif = [];

		for (let chanID in channelCache[configGuild[message.channel.name].canal]) {
			let chan = channelCache[configGuild[message.channel.name].canal][chanID];
			let actif = require(`../guilds/${chan.guild.id}/partiels_config.json`)[chan.name].activated;

			if (actif)
				chanActif.push(chan);
		}

		// on envoie le message a tout les channels actifs du canal
		for (let chan of chanActif) {
			if (chan.id === message.channel.id) continue;

			chan.send(`${message.author.username} : ${message.content}`, message.attachments.array());
		}


	})
}


module.exports = { name, description, init };
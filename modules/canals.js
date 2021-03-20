const fs = require('fs');

const name = "partiel"

const description = "module de mise en commun des ressources"

let channelCache = {};

function init(client) {

	client.on('message', async message => {

		if (message.author.bot || message.channel.type === 'dm') return;

		const configGlobal = JSON.parse(fs.readFileSync("./config/canals_config.json"));

		// On vérifie l'existence de canals_config.json pour ce serveur
		if (!fs.readdirSync(`./guilds/${message.guild.id}`).includes('canals_config.json')) return;

		const configGuild = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/canals_config.json`));

		// on vérifie si le message a été envoyé dans un channel setup et activé
		if (!configGuild[message.channel.name] || !configGuild[message.channel.name].activated) return;

		// on récupère tout les channels du canal
		const canal = configGuild[message.channel.name].canal;
		let channels = configGlobal[canal];

		//mise en cache si besoin
		if (!channelCache[canal])
			channelCache[canal] = {};

		for (const channelId of channels) {
			if (channelCache[canal][channelId]) continue;

			try {
				channelCache[canal][channelId] = await client.channels.fetch(channelId);
			}
			catch (e) {
				err("Impossible de fetch le channel", null, e);
			}
		}

		// pour chaque channel du canal, on vérifie s'ils sont activé ou non
		let chanActif = [];

		for (const chanID in channelCache[canal]) {
			let chan = channelCache[canal][chanID];
			const actif = JSON.parse(fs.readFileSync(`./guilds/${chan.guild.id}/canals_config.json`))[chan.name].activated;

			if (actif)
				chanActif.push(chan);
		}

		// on envoie le message a tout les channels actifs du canal
		for (let chan of chanActif) {
			if (chan.id === message.channel.id) continue;

			chan.send(`${message.author.username} : ${message.content}`, message.attachments.array()).catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));
		}


	})
}


module.exports = { name, description, init };

function err(text, msg, err) {
	require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}
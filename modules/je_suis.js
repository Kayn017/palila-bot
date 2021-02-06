const Discord = require('discord.js')

const name = "je_suis";

const description = "Fait la meilleure vanne du monde";

function init(client) {
	client.on('message', message => {

		const config = require(`../guilds/${message.guild.id}/config.json`);

		if (message.author.bot || !config.je_suis) return;

		if (message.content.toLowerCase().includes("je suis")) {

			let reponse = "";
			if (message.content.toLowerCase().split('je suis')[1])
				reponse = message.content.toLowerCase().split('je suis')[1];
			else
				reponse = message.content.toLowerCase().split('je suis')[0];

			message.reply(`Enchanté *${reponse.trim()}*, je suis ${client.user.username} ! :D`)
		}

	});
}

module.exports = { name, description, init };
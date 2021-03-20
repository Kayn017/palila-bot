const fs = require('fs');

const name = "je_suis";

const description = "Fait la meilleure vanne du monde";

function init(client) {
	client.on('message', async message => {

		// on ne réagit pas si le message a été envoyé en dm
		if (message.channel.type === 'dm') return;

		// on lit le fichier de conf du serv
		const config = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));

		// si le module n'est pas activé ou si l'author du message est un bot => osef
		if (message.author.bot || !config.je_suis) return;

		if (message.content.toLowerCase().includes("je suis")
			|| message.content.toLowerCase().includes("j'suis")) {

			let reponse = "";
			if (message.content.toLowerCase().split('je suis')[1])
				reponse = message.content.toLowerCase().split('je suis')[1].substring(1, 1000);
			else
				reponse = message.content.toLowerCase().split('je suis')[0].substring(1, 1000);

			message.reply(`enchanté *${reponse.trim()}*, je suis ${client.user.username} ! :D`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;
		}
		else if (message.content.toLowerCase().includes("c'est")) {

			let reponse = "";
			if (message.content.toLowerCase().split('c\'est')[1])
				reponse = message.content.toLowerCase().split('c\'est')[1].substring(1, 1000);
			else
				reponse = message.content.toLowerCase().split('c\'est')[0].substring(1, 1000);

			let autre_juste_avant = await message.channel.messages.fetch({ before: message.id, limit: 1 });


			message.reply(`bah non c'est pas *${reponse.trim()}*, c'est ${autre_juste_avant.array()[0] ? autre_juste_avant.array()[0].author.username : "moi (enfin je crois)"} :thinking:`).catch(error => err(`Impossible d'envoyer un message sur le channel.`, message, error));;

		}
	});
}

module.exports = { name, description, init };

function err(text, msg, err) {
	require('../utils').logError(text, name, msg ?? null, err ? err.stack : null)
}
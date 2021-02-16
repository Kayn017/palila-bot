const name = "je_suis";

const description = "Fait la meilleure vanne du monde";

function init(client) {
	client.on('message', async message => {

		if (message.channel.type === 'dm') return;

		const config = require(`../guilds/${message.guild.id}/config.json`);

		if (message.author.bot || !config.je_suis) return;

		if (message.content.toLowerCase().includes("je suis")
			|| message.content.toLowerCase().includes("j'suis")) {

			let reponse = "";
			if (message.content.toLowerCase().split('je suis')[1])
				reponse = message.content.toLowerCase().split('je suis')[1];
			else
				reponse = message.content.toLowerCase().split('je suis')[0];

			message.reply(`enchanté *${reponse.trim()}*, je suis ${client.user.username} ! :D`);
		}
		else if (message.content.toLowerCase().includes("c'est")) {

			let reponse = "";
			if (message.content.toLowerCase().split('c\'est')[1])
				reponse = message.content.toLowerCase().split('c\'est')[1];
			else
				reponse = message.content.toLowerCase().split('c\'est')[0];

			let autre_juste_avant = await message.channel.messages.fetch({ before: message.id, limit: 1 });

			message.reply(`bah non c'est pas*${reponse.trim()}*, c'est ${autre_juste_avant.array()[0].author.username} :thinking:`);
		}

	});
}

module.exports = { name, description, init };
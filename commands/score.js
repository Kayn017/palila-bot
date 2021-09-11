const fs = require("fs");

const name = "score";

const synthax = `${name}`;

const description = `Affiche le nombre de points pour le module lynch`;

const explication = `Cette commande affiche le score de l'utilisateur pour le module lynch`;

const author = `Kayn`;

async function execute(message, args) {

	if (message.channel.type === "dm")
		return message.channel.send("Cette commande ne peut pas être utilisé en MP.").catch(e => err("Impossible d'envoyer un message", message, e));

	if (!fs.existsSync(`./guilds/${message.guild.id}/scores.json`))
		return message.channel.send("Aucun score enregistré pour ce serveur.").catch(e => err("Impossible d'envoyer un message", message, e));

	const scores = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/scores.json`));


	return message.channel.send(`Vous avez **${scores[message.author.id] ?? 0}** points !`).catch(e => err("Impossible d'envoyer un message", message, e));;

}



function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}



module.exports = { name, synthax, description, explication, author, execute };
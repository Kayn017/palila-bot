const name = "invit"

const synthax = `${name}`

const description = `permet d'obtenir le lien d'invitation du bot`

const explication = `Cette commande vous permet d'obtenir le lien d'invitation du bot, pour l'inviter sur votre serveur !`

const author = "Kayn"

async function execute(message, args) {

	const invit = `https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=0&scope=bot`

	return message.channel.send(`Voici le lien d'invitation du bot ! \n${invit}`).catch(e => err("Impossible d'envoyer un message sur ce channel", message, e));

}

module.exports = { name, synthax, description, explication, author, execute };


function err(text, msg, err) {
	require('../services/log').logError(text, name, msg ?? null, err ? err.stack : null)
}
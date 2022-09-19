const { EmbedBuilder } = require("discord.js");
const { err, log } = require("../../services/log");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { download } = require("../../services/http");
const { zip, COMPRESSION_LEVEL  } = require("zip-a-folder");


async function execute(client, options) {

	const channel = await client.channels.fetch(options.channelId);

	log(`Lancement d'une backup du channel ${channel.name} sur le serveur ${channel.guild.name}`, "downloader");

	let embed = new EmbedBuilder()
		.setTitle("Backup du channel en cours...")
		.setColor(process.env.COLOR)
		.setFields(
			{ name: "Messages scannées", value: "0 message scanné" },
			{ name: "Attachments trouvés", value: "0 attachment trouvé" },
			{ name: "Fichiers téléchargés", value: "0 fichier téléchargé" },
			{ name: "Archivage des fichiers", value: "En attente..." }
		);

	const statusMessage = await channel.send({
		embeds: [embed]
	}).catch(e => err("Impossible d'envoyer un message sur ce channel.", null, e));

	// scan des messages du channel
	const allMessages = [];
	let numberOfMessagesFound = 0;
	let lastid;

	do {
		const options = { limit: 100 };
		if(lastid) 
			options.before = lastid;
		
		let messages = await channel.messages.fetch(options);
		messages = [...messages.values()];
		allMessages.push(...messages);

		numberOfMessagesFound += messages.length;

		if(messages.length > 0)
			lastid = messages[messages.length - 1].id;

		await updateStatusMessage(statusMessage, embed, numberOfMessagesFound);
	}
	while(numberOfMessagesFound !== 0 && numberOfMessagesFound % 100 === 0);

	// récupération des attachments
	let numberOfAttachmentFound = 0;
	const allAttachments = [];

	for(const msg of allMessages) {
		const attachments = [...msg.attachments.values()];
		if (attachments.length > 0) {
			allAttachments.push(...attachments);
			numberOfAttachmentFound += attachments.length;
			if(numberOfAttachmentFound % 20 === 0) {
				await updateStatusMessage(statusMessage, embed, numberOfMessagesFound, numberOfAttachmentFound);
			}
		}
	}

	// début du téléchargement
	const now = new Date();
	let folderPath = path.join(
		// eslint-disable-next-line no-undef
		__dirname,
		"..",
		"..",
		"files",
		channel.guild.id,
		channel.id,
		`backup_${channel.name}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`
	);

	fs.mkdirSync(folderPath, { recursive: true });

	let nbFilesDownloaded = 0;

	for(const att of allAttachments) {

		let name = att.name;
		let extension = "";

		if(name.includes(".")) {
			name = att.name.split(".").slice(0, att.name.split(".").length - 1).join(".");
			extension = "." + att.name.split(".").slice(att.name.split(".").length - 1)[0];
		}

		const nbFilesWithTheSameName = fs.readdirSync(path.join(folderPath)).filter(file => file.startsWith(name)).length;
		const filename = `${name}-${nbFilesWithTheSameName}${extension}`;
		
		await download(att.url, path.join(folderPath, filename));
		nbFilesDownloaded++;

		if(nbFilesDownloaded % 10 === 0) 
			await updateStatusMessage(statusMessage, embed, numberOfMessagesFound, numberOfAttachmentFound, nbFilesDownloaded);
	}

	// création de l'archive
	await updateStatusMessage(statusMessage, embed, numberOfMessagesFound, numberOfAttachmentFound, nbFilesDownloaded, 1);

	const zipname = `backup_${channel.name}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.zip`;

	await zip(folderPath, path.join(
		folderPath, 
		"..",
		zipname
	), 
	{
		compression: COMPRESSION_LEVEL.high
	});

	await updateStatusMessage(statusMessage, embed, numberOfMessagesFound, numberOfAttachmentFound, nbFilesDownloaded, 2);

	// suppression du dossier de téléchargement
	fs.rmSync(folderPath, { recursive: true, force: true });

	await channel.send({
		content: `La backup est terminé !\nL'archive est disponible ici : http://${process.env.API_BASE_PATH}:${process.env.API_PORT}/backup/${channel.guild.id}/${channel.id}/${zipname}`
	});
}

async function updateStatusMessage(statusMessage, embed, scanned = 0, attachments = 0, downloaded = 0, archiveState = 0) {
	
	let state;
	switch(archiveState) {
	case 0: 
		state = "En attente...";
		break;
	case 1: 
		state = "En cours";
		break;
	case 2: 
		state = "Terminé";
		break;
	}
	
	embed = embed.setFields(
		{ name: "Messages scannées", value: `${scanned} message${scanned > 1 ? "s" : ""} scanné${scanned > 1 ? "s" : ""}` },
		{ name: "Attachments trouvés", value: `${attachments} attachment${attachments > 1 ? "s" : ""} trouvé${attachments > 1 ? "s" : ""}` },
		{ name: "Fichiers téléchargés", value: `${downloaded} fichier${downloaded > 1 ? "s" : ""} téléchargé${downloaded > 1 ? "s" : ""}` },
		{ name: "Archivage des fichiers", value: state }
	);

	embed = embed.setTitle(archiveState === 2 ? "Backup du channel terminé !" : "Backup du channel en cours...");

	await statusMessage.edit({
		embeds: [embed]
	});
}

module.exports = {
	execute
};
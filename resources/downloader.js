const Discord = require('discord.js');
const fs = require('fs');
const http = require('http');
const https = require('https');
const execSync = require('child_process').execSync;
const worker = require('worker_threads');

const config = require('../config/config.json')

async function downloadChan(message) {

	return message.channel.send("Cette fonctionnalité est pour l'instant désactivée.");

	message.channel.send(`Lancement de la backup du channel en cours... Merci de ne plus envoyer de messages ici avant la fin du scan du channel :eyes:`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] Lancement de la backup par ${message.author.tag}`)

	//on déclare les tableaux qui vont contenir tout les messages analysés
	let tout = [];
	let msg_img = [];
	let youtube_url = [];
	let twitter_url = [];
	let last_id;

	while (true) {
		//on récupère tout les messages du channel
		let options = { limit: 100 };
		if (last_id)
			options.before = last_id;

		let messages = await message.channel.messages.fetch(options);

		//on les met tous dans le tableau tout
		messages.forEach(msg => {
			tout.push(msg);
		});

		last_id = messages.array()[messages.array().length - 1].id;

		if (messages.array().length != 100)
			break;

	}

	tout.forEach(msg => {

		// images et vidéos discord
		if (msg.attachments.array().length > 0) {
			msg_img.push(msg.attachments);
		}


		// vidéos youtubes
		if (msg.content.includes(`https://www.youtube.com/watch`)) {
			let items = msg.content.split(' ');

			for (let item of items) {
				if (item.startsWith(`https://www.youtube.com/watch`)) {
					youtube_url.push(item);
				}
			}

		}

		if (msg.content.includes(`https://youtu.be/`)) {
			let items = msg.content.split(' ');

			for (let item of items) {
				if (item.startsWith(`https://youtu.be/`)) {
					youtube_url.push(item);
				}
			}
		}


		//vidéos twitter
		if (msg.content.includes(`https://twitter.com/`)) {
			let items = msg.content.split(' ');

			for (let item of items) {
				if (item.startsWith(`https://twitter.com/`)) {
					twitter_url.push(item);
				}
			}
		}

		if (msg.content.includes(`https://t.co`)) {
			let items = msg.content.split(' ');

			for (let item of items) {
				if (item.startsWith(`https://t.co`)) {
					twitter_url.push(item);
				}
			}
		}
	});

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Fin du scan`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Messages trouvées : ${tout.length}`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Messages avec attachements trouvés : ${msg_img.length}`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Vidéos YouTube trouvées : ${youtube_url.length}`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Vidéos Twitter trouvées : ${twitter_url.length}`);

	const embed = new Discord.MessageEmbed()
		.setTitle("Fin du scan")
		.setColor(0x1e80d6)
		.setDescription(
			`Messages trouvées : ${tout.length}
		Messages avec attachements trouvés : ${msg_img.length}
		Vidéos YouTube trouvées : ${youtube_url.length}
		Vidéos Twitter trouvées : ${twitter_url.length}`);

	await message.channel.send(embed);


	let today = new Date();
	let folderName = `Backup_${message.guild.name}_${message.channel.name}_${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Création du dossier ${folderName}...`);

	try {
		let dir = `./guilds/${message.guild.id}/${folderName}`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Dossier créé.`);
		}
		else {
			console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Le dossier existe déjà.`)
		}
	}
	catch (error) {
		console.error(`[downloader.js][${message.guild.name}][${message.channel.name}] : ${error}`);
	}

	await message.channel.send("Début du téléchargement");

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Début du telechargement`);
	let compt = 1;

	//on dl chaque image/video
	for (let att of msg_img) {

		for (let bidule of att) {
			img = bidule[1];

			if (fs.existsSync(`./guilds/${message.guild.id}/${folderName}/${img.name}`)) {
				let nbFiles = fs.readdirSync(`./guilds/${message.guild.id}/${folderName}`).filter(file => file.startsWith(img.name.split(".")[0])).length;
				img.name = img.name.split(".")[0].concat(`-${nbFiles}.`).concat(img.name.split(".")[1]);
			}

			try {
				await download(img.url, `${__dirname}/../guilds/${message.guild.id}//${folderName}/${img.name}`);
			}
			catch (error) {
				console.error(`[downloader.js][${message.guild.name}][${message.channel.name}] : ${error}`);
			}

		}

		compt++;

	}

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Backup des images et des videos terminé`);

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Début du téléchargement des vidéos YouTube`);
	compt = 1;

	//on dl chaque vidéo youtube
	for (let videoURL of youtube_url) {

		try {
			youtubeDownload(videoURL, `${__dirname}/../guilds/${message.guild.id}/${folderName}`);
		}
		catch (error) {
			console.error(`[downloader.js][${message.guild.name}][${message.channel.name}] : ${error}`);
		}


		compt++;
	}

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Vidéos YouTube téléchargés`);


	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Début du téléchargement des vidéos Twitter`);

	compt = 1;

	for (let videoURL of twitter_url) {
		let videoName = "video_twitter.mp4";

		if (fs.existsSync(`./guilds/${message.guild.id}/${folderName}/${videoName}`)) {
			let nbFiles = fs.readdirSync(`./guilds/${message.guild.id}/${folderName}`).filter(file => file.startsWith(videoName.split(".")[0])).length;
			videoName = videoName.split(".")[0].concat(`-${nbFiles}.`).concat(videoName.split(".")[1]);
		}

		try {
			twitterDownload(videoURL, `${__dirname}/../guilds/${message.guild.id}/${folderName}/${videoName}`);
		}
		catch (error) {
			console.error(`[downloader.js][${message.guild.name}][${message.channel.name}] : ${error}`);
		}

		compt++;
	}

	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Vidéos Twitter téléchargés`);
	console.log(`[downloader.js][${message.guild.name}][${message.channel.name}] : Backup terminée`);

	await message.channel.send("Backup terminée ! Demandez à Kayn#2859 pour qu'il vous passe l'archive !");

}

function download(url, dest, cb) {

	return new Promise((resolve, reject) => {
		// on créé un stream d'écriture qui nous permettra
		// d'écrire au fur et à mesure que les données sont téléchargées
		const file = fs.createWriteStream(dest);
		let httpMethod;

		// afin d'utiliser le bon module on vérifie si notre url
		// utilise http ou https
		if (url.indexOf(('https://')) !== -1) httpMethod = https;
		else httpMethod = http;

		// on lance le téléchargement
		const request = httpMethod.get(url, (response) => {
			// on vérifie la validité du code de réponse HTTP
			if (response.statusCode !== 200) {
				return cb('Response status was ' + response.statusCode);
			}

			// écrit directement le fichier téléchargé
			response.pipe(file);

			// lorsque le téléchargement est terminé
			// on appelle le callback
			file.on('finish', () => {
				// close étant asynchrone,
				// le cb est appelé lorsque close a terminé
				file.close(cb);
				resolve("1");
			});

			// check for request error too
			response.on('error', (err) => {
				fs.unlink(dest);
				cb(err.message);
				reject("0");
			});

			// si on rencontre une erreur lors de l'écriture du fichier
			// on efface le fichier puis on passe l'erreur au callback
			file.on('error', (err) => {
				// on efface le fichier sans attendre son effacement
				// on ne vérifie pas non plus les erreur pour l'effacement
				fs.unlink(dest);
				cb(err.message);
				reject("0");
			});
		});
	});
}

function twitterDownload(url, dest) {
	if (process.platform == "win32")
		execSync(`"${__dirname}\\..\\resources\\youtube-dl.exe" -q -o "${dest}" ${url}`);
	else if (process.platform == "linux")
		execSync(`${__dirname}/../resources/youtube-dl -q -o "${dest}" ${url}`);
}

function youtubeDownload(url, dest) {

	if (process.platform == "win32")
		execSync(`"${__dirname}\\..\\resources\\youtube-dl.exe" -q -o "${dest}/%(title)s.%(ext)s" ${url}`);
	else if (process.platform == "linux")
		execSync(`${__dirname}/../resources/youtube-dl -q -o "${dest}/%(title)s.%(ext)s" ${url}`);
}

if (worker.isMainThread) {
	console.error("[downloader.js] Erreur : ce script ne peut fonctionner indépendamment");
	return;
}
else {
	console.log("[downloader.js] Execution du nouveau thread");

	let param = worker.receiveMessageOnPort(worker.parentPort).message;

	const client = new Discord.Client();


	client.on('ready', async () => {
		console.log("[downloader.js] Nouveau client connecté");

		const chan = await client.channels.fetch(param.channelID);

		const message = await chan.messages.fetch(param.msgID);

		if (message === undefined)
			console.error('[downloader.js] Erreur : message est vide');
		else {
			await downloadChan(message);

			client.destroy();
		}


	})

	client.login(config.discord.token);
}


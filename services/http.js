const http = require('http');
const https = require('https');
const fs = require('fs');


async function download(url, dest, cb) {

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

module.exports = { download }
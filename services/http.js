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

function fetch(url, params) {

	const { bearer, headers, json, method, data } = params;

	let options = {};

	if (headers !== undefined) {
		options.headers = headers;
	} else {
		options.headers = {};
	}

	if (bearer !== undefined) {
		options.headers["Authorization"] = `Bearer ${bearer}`;
	}

	if (json === true) {
		options.headers["Accept"] = "application/json";
	}

	if (method !== undefined) {
		options.method = method;
	} else {
		options.method = 'GET';
	}

	return new Promise((resolve, reject) => {

		const httpMethod = url.startsWith('https://') ? https : http;

		let r = httpMethod.request(url, options, res => {

			let bufs = [];

			res.on('data', d => {
				bufs.push(d);
			})

			res.on('end', async () => {
				let data = Buffer.concat(bufs);

				if (json === true) {
					try {
						let text = await data.toString();
						resolve({
							status: res.statusCode,
							headers: res.headers,
							data: JSON.parse(text)
						});
					} catch (e) {
						reject(e);
					}
				} else {
					resolve(data);
				}
			})


		}).on('error', e => {
			reject(e);
		})

		if (data !== undefined) {
			if (json === true) {
				r.setHeader('Content-Type', 'application/json');
				r.write(JSON.stringify(data), 'utf8');
			} else {
				r.write(data);
			}
		}

		r.end();
	})
}


module.exports = { download, fetch }
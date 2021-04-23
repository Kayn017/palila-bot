const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

// template des fichiers de configurations globaux
// chaque clé => le nom du fichier de config
// chaque objet => contenu du fichier
const fileConfig = {
	config: {
		discord: {
			token: null,
			gods: []
		},
		prefix: ","
	},
	canals_config: {},
	presence: {
		status: "online",
		activity: {
			name: "September",
			type: "LISTENING"
		}
	},
	citation_rules: {},
	blacklist: []
}

CreateFilesConfig();

// récupération du fichier de configuration du bot
const config = require(`${__dirname}/config/config.json`);

// on créé le client + on se prépare a la connexion
const client = new Discord.Client();

client.on('ready', () => {
	log(`Connecté à Discord en tant que ${client.user.tag}`);
	CreateGuildsFolder()
});


// on importe toutes les commandes 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

	const cmd = require(`${__dirname}/commands/${file}`);
	client.commands.set(cmd.name, cmd);
}



client.db = require('./models');

// puis on importe tout les modules
const modulesFiles = fs.readdirSync(`${__dirname}/modules`).filter(file => file.endsWith('.js'));

for (const file of modulesFiles) {

	const mod = require(`${__dirname}/modules/${file}`);
	mod.init(client);
}


//reactions a chaque message
client.on('message', message => {

	const blacklist = JSON.parse(fs.readFileSync(`./config/blacklist.json`));

	if (blacklist.includes(message.author.id)) return;

	//on vérifie le préfixe du bot sur le serveur
	let prefix = config.prefix;
	let whitelist = false;

	// si le message a été envoyé dans une guild, on prend la configuration de cette guild
	if (message.channel.type !== 'dm') {
		const configGuidldsFile = JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/config.json`));
		prefix = configGuidldsFile.prefix;
		whitelist = configGuidldsFile.whitelist;
	}

	//si le channel est whitelisté, on s'arrete la
	if (whitelist)
		if (!JSON.parse(fs.readFileSync(`./guilds/${message.guild.id}/whitelist.json`)).channels.includes(message.channel.id)) return;



	// si le message ne commence pas par le préfixe du bot ou si c'est un bot qui parle, osef
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	//on chope les arguments
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase(); //on extrait la commande

	//si on connait pas la commande osef
	if (!client.commands.has(commandName)) return;

	const commande = client.commands.get(commandName);

	commande.execute(message, args)
		.catch(error => {
			message.channel.send(new Discord.MessageEmbed()
				.setColor(0xFF0000)
				.setTitle("Erreur interne")
				.setDescription(error.stack)
			);
			err(`L'execution de la commande ${commandName} a échoué.`, message, error);
		})


});

client.on('guildCreate', guild => {
	log(`Arrivée du bot sur le serveur ${guild.name}`);
	CreateGuildsFolder();
})


// on se connecte a discord 
client.login(config.discord.token);

/** créé les fichiers et dossiers de configurations pour chaque serveur s'il n'existe pas
 */
function CreateGuildsFolder() {
	//on récupère chaque dossier existant
	const existantFolders = fs.readdirSync(`${__dirname}/guilds`);

	//pour chaque guilds dans lequel le bot est présent
	for (let g of client.guilds.cache.values()) {

		//si le dossier de la guild n'existe pas
		if (!existantFolders.includes(g.id)) {

			// création du dossier de la guilde
			try {
				fs.mkdirSync(`${__dirname}/guilds/${g.id}`);
				log(`Dossier de la guilde ${g.name} créé`);
			}
			catch (e) {
				err(`Impossible de créer le dossier de la guilde ${g.name}`, null, e);
			}

			// création du fichier de configuration de la guild
			const configFileContent = {
				name: g.name,
				prefix: config.prefix,
				adminRoles: null,
				je_suis: false,
				Vquidab: false,
				whitelist: false
			}

			try {
				fs.writeFileSync(`${__dirname}/guilds/${g.id}/config.json`, JSON.stringify(configFileContent));
				log(`Fichier de configuration de la guilde ${g.name} créé`);
			}
			catch (e) {
				err(`Impossible de créer le fichier de configuration de la guilde ${g.name}`, null, e);
			}

		}
	}
}

/**
 * créé les fichiers de configurations globaux absents 
 */
function CreateFilesConfig() {

	// pour chaque template, on créé un fichier de config, s'il manque
	for (const [fileName, fileContent] of Object.entries(fileConfig)) {
		if (!fs.existsSync(`${__dirname}/config/${fileName}.json`)) {
			try {
				fs.writeFileSync(`${__dirname}/config/${fileName}.json`, JSON.stringify(fileContent));
				log(`Création du fichier de configuration ${fileName}.json`);
			}
			catch (error) {
				err(`Impossible de créer le fichier ${__dirname}/config/${fileName}.json`, null, error);
			}

		}
	}

}

/**
 * Logs simplifié
 * @param {*} text : texte a afficher
 */
function log(text) {
	require('./services/log').logStdout(text, "index", null);
}

/**
 * logs d'erreurs simplifié
 * @param {*} text : texte a afficher
 * @param {*} msg : message qui a provoqué l'erreur
 * @param {*} err : l'erreur en elle meme
 */
function err(text, msg, e) {
	require('./services/log').logError(text, "index", msg ?? null, e ? e.stack : null)
}
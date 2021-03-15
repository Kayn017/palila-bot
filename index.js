const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const fileConfig = {
	config: {
		discord: {
			token: null
		},
		prefix: ","
	},
	partiels_config: {},
	presence: {
		status: "online",
		activity: {
			name: "September",
			type: "LISTENING"
		}
	},
	citation_rules: {}
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
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

	const cmd = require(path.join(__dirname, "commands", file));
	client.commands.set(cmd.name, cmd);
}


// puis on importe tout les modules autre
const modulesFiles = fs.readdirSync(path.join(__dirname, "modules")).filter(file => file.endsWith('.js'));

for (const file of modulesFiles) {

	const mod = require(path.join(__dirname, "modules", file));
	mod.init(client);
}



client.on('message', message => {

	//on vérifie le préfixe du bot sur le serveur
	let prefix = config.prefix;
	let whitelist = false;

	if (message.channel.type !== 'dm') {
		prefix = require(`./guilds/${message.guild.id}/config.json`).prefix;
		whitelist = require(`./guilds/${message.guild.id}/config.json`).whitelist;
	}

	if (whitelist)
		if (!require(`./guilds/${message.guild.id}/whitelist.json`).channels.includes(message.channel.id)) return;



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

/** créé les fichiers de configurations pour chaque serveur s'il n'existe pas
 */
function CreateGuildsFolder() {
	const folderExistants = fs.readdirSync(path.join(__dirname, "guilds"));

	for (let g of client.guilds.cache.values()) {

		if (!folderExistants.includes(g.id)) {
			// création du dossier de la guilde
			try {
				fs.mkdirSync(path.join(__dirname, "guilds", g.id));
				log(`Dossier de la guilde ${g.name} créé`);
			}
			catch (e) {
				err(`Impossible de créer le dossier de la guilde ${g.name}`, null, e);
			}

			// création du fichier de configuration
			const contenuConfigFile = {
				name: g.name,
				prefix: config.prefix,
				adminRoles: null,
				je_suis: false,
				Vquidab: false,
				whitelist: false
			}

			try {
				fs.writeFileSync(path.join(__dirname, "guilds", g.id, "config.json"), JSON.stringify(contenuConfigFile));
				log(`Fichier de configuration de la guilde ${g.name} créé`);
			}
			catch (e) {
				err(`Impossible de créer le fichier de configuration de la guilde ${g.name}`, null, e);
			}

		}
	}
}

function CreateFilesConfig() {

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

function log(text) {
	require('./utils').logStdout(text, "index", null);
}

function err(text, msg, err) {
	require('./utils').logError(text, "index", msg ?? null, err ? err.stack : null)
}
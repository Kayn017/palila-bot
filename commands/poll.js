/********** REQUIRE **********/
const Discord = require('discord.js');
const { stringToMs } = require('../services/time');
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;
const { color } = require('../config/config.json');
const { addButton } = require('../services/buttons');
const { LocalCache } = require('../services/cache');

/********** INFORMATIONS **********/
const name = "poll";
const description = "Créé un sondage";
const explication = "Cette commande permet de créer un sondage";
const author = "Kayn";
const options = [{
	name: "intitule",
	type: "STRING",
	description: "Intitulé du sondage",
	required: true
},
{
	name: "choix1",
	type: "STRING",
	description: "Choix 1",
	required: true
},
{
	name: "choix2",
	type: "STRING",
	description: "Choix 2",
	required: true
},
{
	name: "choix3",
	type: "STRING",
	description: "Choix 3",
	required: false
},
{
	name: "choix4",
	type: "STRING",
	description: "Choix 4",
	required: false
},
{
	name: "choix5",
	type: "STRING",
	description: "Choix 5",
	required: false
},
{
	name: "duree",
	type: "STRING",
	description: "Durée du sondage",
	required: false
}];


/********** PERMISSIONS **********/
const intents = [];
const permissions = [];


/********** VALUE **********/
const DEFAULT_DURATION = 60 * 60 * 1000;
const cache = new LocalCache("poll");


/********** ACTIONS **********/
async function execute(interaction, options) {

	const title = options.find(o => o.name === "intitule").value;

	const choice1 = options.find(o => o.name === "choix1").value;
	const choice2 = options.find(o => o.name === "choix2").value;

	const choice3 = options.find(o => o.name === "choix3")?.value;
	const choice4 = options.find(o => o.name === "choix4")?.value;
	const choice5 = options.find(o => o.name === "choix5")?.value;

	const duration = options.find(o => o.name === "duree")?.value;

	let pollDuration;

	if (duration) {
		try {
			pollDuration = stringToMs(duration);
		}
		catch (err) {
			return interaction.reply({ content: "Le format de la date est invalide. Elle doit être au format `<nombre><j ou h ou m ou s>`.\nExemple : `10j` pour 10 jours, `30m` pour 30 minutes.", ephemeral: true });
		}
	}
	else {
		pollDuration = DEFAULT_DURATION;
	}


	const endDate = new Date(Date.now() + pollDuration);
	const endDateString = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()} à ${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;

	const embed = new Discord.MessageEmbed();

	embed.setTitle(title);
	embed.setAuthor(interaction.user.username, interaction.user.avatarURL());
	embed.setColor(color);
	embed.setDescription("Votez sur les boutons ci-dessous !");
	embed.addField("Date de fin du sondage", endDateString);


	const row = new Discord.MessageActionRow();

	addButton(row, choice1);
	addButton(row, choice2);

	if (choice3)
		addButton(row, choice3);
	if (choice4)
		addButton(row, choice4);
	if (choice5)
		addButton(row, choice5);

	const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });




	collectVotes(response, pollDuration);

}

function init(client) { }

function shutdown(client) { }




function collectVotes(voteMessage, pollDuration) {

	const filter = (interaction) => interaction.isButton();

	const collector = voteMessage.createMessageComponentCollector({ filter, time: pollDuration, dispose: true });

	collector.on('collect', i => {

		console.log(i.user.id)
		console.log(i.customId)

		i.reply({ content: `Vous avez voté \`${i.customId}\``, ephemeral: true });
	})

}


/********** EXPORTS **********/
module.exports = { name, description, explication, author, options, intents, permissions, execute, init, shutdown }
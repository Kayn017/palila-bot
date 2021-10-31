const { MessageEmbed } = require("discord.js");
const db = require("../../../../core/database");
const process = require("process");

function init() {

}
function shutdown() {

}
async function execute(interaction) {
	const guildId = interaction.guild.id;

	const groups = await db.Group.findAll({ where: { guildId } });

	const embed = new MessageEmbed()
		.setColor(process.env.COLOR)
		.setAuthor(interaction.member.displayName, interaction.user.avatarURL());

	let list = "";

	for(const g of groups) {
		list += ` - ${g.name}\n`;	
	}

	if(groups.length === 0) {
		list = "Aucun groupe n'a été créé";
	}

	embed.setDescription(list);

	interaction.reply({ embeds: [embed] });
}
async function middleware() {

}
async function configure() {

}
module.exports = {
	init,
	shutdown,
	execute,
	middleware,
	configure,
};

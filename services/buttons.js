const Discord = require('discord.js');

function addButton(actionRow, label, customID) {
	actionRow.addComponents(
		new Discord.MessageButton()
			.setCustomId(customID ?? label)
			.setLabel(label)
			.setStyle("PRIMARY")
	)
}

module.exports = {
	addButton
}
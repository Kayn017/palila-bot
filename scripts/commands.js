const Discord = require("discord.js");
const process = require("process");
require("dotenv").config();

const client = new Discord.Client({
	intents: Discord.GatewayIntentBits.Guilds
});

client.login(process.env.TOKEN).then( () => {

	if(process.argv[2] === "CLEAN_COMMANDS") {

		client.application.commands.fetch().then( async applicationCommands => {
			applicationCommands.forEach(c => {
				c.delete();
				console.log(`Suppression de la commande ${c.name}.`);
			});
		});

		client.guilds.fetch().then( guilds => {
			
			guilds.forEach( async g => {
				const guild = await g.fetch();

				const commands = await guild.commands.fetch();
 
				commands.forEach( cmd => {
					cmd.delete();
					console.log(`Suppression de la commande ${cmd.name} de la guilde ${guild.name}.`);
				});
			});

		});
	}
});
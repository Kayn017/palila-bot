const Discord = require("discord.js");
const path = require('path');
const fs = require('fs');

const { createConfigFolderAndFiles } = require("./core/config/configFiles");
const { initConfig } = require("./core/config/initConfig");
const { createStructure } = require("./core/structure");
const { fetchCommands, initCommands } = require('./core/commands/commandManager');
const { fetchModules } = require("./core/modules/moduleManager");
const { getAllIntents } = require("./core/permissions/intentsManager");
const { getAllPermissions } = require("./core/permissions/permissionsManager");

const { log } = require("./services/log");

// creation of all the structure of the bot
if (!fs.existsSync('./log'))
	fs.mkdirSync('./log');

createConfigFolderAndFiles();
createStructure();

// init configuration of the bot
initConfig();

const config = JSON.parse(fs.readFileSync(`./config/config.json`));

// init commands and modules
const commands = fetchCommands(path.join(__dirname, "commands"));
const modules = fetchModules(path.join(__dirname, "modules"));

// get all intents and permissions
const intents = getAllIntents(commands, modules);
const permissions = getAllPermissions(commands, modules);

const client = new Discord.Client({
	intents
});

client.commands = commands;
client.modules = modules;
client.permissions = permissions;


client.on('ready', () => {
	log(`Connecté à Discord en tant que ${client.user.tag}`, "index");

	initCommands(client)

	client.modules.forEach(m => m.init(client));

})

client.login(config.discord.token);
const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");

const { createConfigFolderAndFiles } = require("./core/config/configFiles");
const { initConfig } = require("./core/config/initConfig");
const { createStructure } = require("./core/structure");
const { fetchCommands, initCommands } = require("./core/commands/commandManager");
const { fetchModules } = require("./core/modules/moduleManager");
const { getAllIntents } = require("./core/permissions/intentsManager");
const { getAllPermissions, manageBotRole } = require("./core/permissions/permissionsManager");
const { executeCommand } = require("./core/commands/commandExecutor");
const { createGuildsFiles } = require("./core/guilds/guildsFiles");

const { log } = require("./services/log");

// creation of all the structure of the bot
if (!fs.existsSync("./log"))
	fs.mkdirSync("./log");

createConfigFolderAndFiles();
createStructure();

// init configuration of the bot
initConfig();

const config = JSON.parse(fs.readFileSync("./config/config.json"));

// get commands and modules
// eslint-disable-next-line no-undef
const commands = fetchCommands(path.join(__dirname, "commands"));
// eslint-disable-next-line no-undef
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



client.once("ready", async () => {
	log(`Connecté à Discord en tant que ${client.user.tag}`, "index");

	createGuildsFiles(await client.guilds.fetch());

	await manageBotRole(client);

	await initCommands(client);

	client.modules.forEach(m => m.init(client));

	log("Le bot est prêt à fonctionner !", "index");
});

// command handling
client.on("interactionCreate", interaction => {

	if (!interaction.isCommand()) return;

	executeCommand(client.commands, interaction.commandName, interaction.options.data, interaction);
});

client.login(config.discord.token);
const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const process = require("process");
require("dotenv").config();
const { log } = require("./services/log");
const { fetchCommands, initCommands, handleCommand } = require("./core/commands");
const { fetchModules, initModules } = require("./core/modules");
const { getAllPermissions } = require("./core/permissions");

global.devEnv = process.argv.includes("--DEV");

if (!fs.existsSync("./log"))
	fs.mkdirSync("./log");

const { createBotStructure } = require("./core/structure");
const { getAllIntents } = require("./core/intents");
createBotStructure();

const database = require("./core/database");
const { handleError } = require("./core/errors");
const handleExtinctionSignal = require("./core/extinction");
const { handleNewGuild } = require("./core/guilds")
const api = require("./core/api");
const redisClient = require("./core/config");

// eslint-disable-next-line no-undef
const commands = fetchCommands(path.join(__dirname, "commands"));
// eslint-disable-next-line no-undef
const modules = fetchModules(path.join(__dirname, "modules"));

const intents = getAllIntents(commands, modules);
const permissions = getAllPermissions(commands, modules);

const client = new Discord.Client({
	intents
});

client.commands = commands;
client.modules = modules;
client.db = database;
client.config = redisClient;
client.permissions = permissions;
client.api = api;

handleError(client);
handleExtinctionSignal(client);
handleNewGuild(client);

client.once("ready", async () => {
	log(`Connecté à Discord en tant que ${client.user.tag}`, "index");

	await initCommands(client);
	await initModules(client);

	handleCommand(client);
});

client.login(process.env.TOKEN);
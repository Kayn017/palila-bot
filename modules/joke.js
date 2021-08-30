const Discord = require("discord.js");
const Intents = Discord.Intents;
const Permissions = Discord.Permissions;

const name = "joke";
const description = "Ca fait des vannes";

const intents = [];
const permissions = [];

function init() { }

function shutdown() { }

module.exports = { name, description, intents, permissions, init, shutdown }
const redis = require("redis");
const process = require("process");
const { promisify } = require("util");
const { err, debug } = require("../../services/log");

const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT
});

client.on("error", e => err(e.message, "redis", null, e.stack));
client.on("message", (c, m) => debug(m, "redis"));
client.on("connect", () => debug("Client de configuration connecté", "redis"));

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);

module.exports = client;
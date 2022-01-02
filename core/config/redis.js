const redis = require("redis");
const process = require("process");
const { err, debug } = require("../../services/log");

const client = redis.createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on("error", e => err(e.message, "redis", null, e.stack));
client.on("message", (c, m) => debug(m, "redis"));
client.on("connect", () => debug("Client de configuration connecté", "redis"));

module.exports = client;
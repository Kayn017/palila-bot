const fs = require("fs");
const { debug } = require("../../services/log");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	storage: "./database/db.sqlite",
	dialect: "sqlite",
	logging: msg => debug(msg, "sqlite", null, null)
});

const db = {};

fs.readdirSync("./models")
	.filter(filename => filename.endsWith(".js"))
	.forEach(filename => {
		const model = require(`../../models/${filename}`)(sequelize);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	db[modelName].associate(db);
});

sequelize.sync();

module.exports = db;
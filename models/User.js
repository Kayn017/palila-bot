const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class User extends Sequelize.Model {
		static associate(db) {
			User.hasMany(db.LynchScore, { onDelete: "cascade" });
		}
	}

	User.init({
		discordid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		god: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize,
		modelName: "User",
		tableName: "User"
	});

	return User;
};
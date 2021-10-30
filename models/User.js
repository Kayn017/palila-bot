const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class User extends Sequelize.Model {
		static associate() {
		}
	}

	User.init({
		discordid: {
			type: DataTypes.STRING,
			allowNull: false
		},
		god: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: "User",
		tableName: "User"
	});

	return User;
};
const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class LynchScore extends Sequelize.Model {
		static associate(db) {
			LynchScore.belongsTo(db.User, { onDelete: "cascade" });
		}
	}

	LynchScore.init({
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		UserDiscordid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: "User",
				key: "discordid"
			}
		},
		points: {
			type: DataTypes.NUMBER,
			allowNull: false,
			defaultValue: 0
		},
		voteHistory: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: []
		}
	}, 
	{
		sequelize,
		modelName: "LynchScore",
		tableName: "LynchScore"
	});

	return LynchScore;
};
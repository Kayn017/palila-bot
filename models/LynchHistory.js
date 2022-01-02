const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class LynchHistory extends Sequelize.Model {
		static associate() {
		}
	}

	LynchHistory.init({
		day: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW
		},
		number: {
			type: DataTypes.NUMBER,
			allowNull: false
		}
	}, 
	{
		sequelize,
		modelName: "LynchHistory",
		tableName: "LynchHistory"
	});

	return LynchHistory;
};
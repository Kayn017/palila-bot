const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class LynchHistory extends Sequelize.Model {
		static associate() {
		}
	}

	LynchHistory.init({
		number: {
			type: DataTypes.INTEGER,
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
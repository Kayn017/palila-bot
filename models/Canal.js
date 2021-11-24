const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class Canal extends Sequelize.Model {
		static associate() {
			
		}
	}

	Canal.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nbChannelsConnected: {
			type: DataTypes.NUMBER,
			allowNull: true,
		},
	}, 
	{
		sequelize,
		modelName: "Canal",
		tableName: "Canal"
	});

	return Canal;
};
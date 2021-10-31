const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class Group extends Sequelize.Model {
		static associate() {
		}
	}

	Group.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roleId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		guildId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, 
	{
		sequelize,
		modelName: "Group",
		tableName: "Group"
	});

	return Group;
};
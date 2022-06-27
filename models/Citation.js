const { Sequelize, DataTypes } = require("sequelize");

module.exports = sequelize => {

	class Citation extends Sequelize.Model {
		static associate() {
		}
	}

	Citation.init({
		person: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		authorId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "User",
				key: "discordid"
			}
		},
		fileLocation: {
			type: DataTypes.STRING,
			allowNull: false
		},
		deleteDate: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, 
	{
		sequelize,
		modelName: "Citation",
		tableName: "Citation"
	});

	return Citation;
};
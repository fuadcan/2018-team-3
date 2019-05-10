"use strict"
module.exports = {
  up: queryInterface => {
    return queryInterface.dropTable("experiment_cardset")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable("experiment_cardset", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      cardSetId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      expId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      }
    })
  },
}

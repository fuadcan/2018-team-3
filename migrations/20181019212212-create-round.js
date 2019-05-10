"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("round", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expId: {
        type: Sequelize.INTEGER,
        references: { model: "experiment", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      length: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
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
      }
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("round")
  }
}

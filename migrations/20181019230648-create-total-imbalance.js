"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("totalimbalance", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      top: {
        type: Sequelize.INTEGER
      },
      tsp: {
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
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transaction",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("totalimbalance")
  }
}

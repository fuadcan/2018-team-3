"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("playerimbalance", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ow: {
        type: Sequelize.INTEGER
      },
      ob: {
        type: Sequelize.INTEGER
      },
      sw: {
        type: Sequelize.INTEGER
      },
      sb: {
        type: Sequelize.INTEGER
      },
      to: {
        type: Sequelize.INTEGER
      },
      ts: {
        type: Sequelize.INTEGER
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transaction",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      playerId: {
        type: Sequelize.STRING,
        references: {
          model: "player",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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
    return queryInterface.dropTable("playerimbalance")
  }
}

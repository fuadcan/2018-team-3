"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Product belongsToMany Tag
    return queryInterface.createTable("player_card", {
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
      cardId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "cards",
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
      }
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable("player_card")
  }
}

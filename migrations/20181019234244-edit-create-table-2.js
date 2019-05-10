"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("cards", "cardsetId", {
      type: Sequelize.INTEGER,
      references: {
        model: "cardset",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("cards", "cardsetId", {
      type: Sequelize.INTEGER,
      references: {
        model: "cardset",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    })
  }
}

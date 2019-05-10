"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("round", "cardsetId", {
      type: Sequelize.INTEGER,
      references: {
        model: "cardset",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("round", "cardsetId", {
      type: Sequelize.INTEGER,
      references: {
        model: "cardset",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    })
  }
}

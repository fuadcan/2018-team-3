"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("cards", "secondaryValue", Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "cards",
      "secondaryValue",
      Sequelize.STRING
    )
  }
}

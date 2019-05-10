"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("player", "sessionId", Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "player",
      "sessionId",
      Sequelize.STRING
    )
  }
}

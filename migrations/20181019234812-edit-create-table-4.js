"use strict"

module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable("cards", "card")
  },

  down: queryInterface => {
    return queryInterface.renameTable("card", "cards")
  }
}

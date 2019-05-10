"use strict"

module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn("cards", "value", "mainValue")
  },

  down: queryInterface => {
    return queryInterface.renameColumn("cards", "mainValue", "value")
  }
}

"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("card", "img", {
      type: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("card", "img", {
      type: Sequelize.STRING
    })
  }
}

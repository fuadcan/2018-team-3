"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("round", "start").then(function () {
      return queryInterface.removeColumn("round", "end").then(function(){
        return queryInterface.changeColumn("round", "length" , {
          allowNull: true,
          type: Sequelize.DOUBLE,
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("round", "start", { type: Sequelize.DATE }).then(function () {
      return queryInterface.addColumn("round", "end", { type: Sequelize.DATE }).then(function(){
        return queryInterface.changeColumn("round", "length" , { type: Sequelize.INTEGER })
      })
    })
  }
}

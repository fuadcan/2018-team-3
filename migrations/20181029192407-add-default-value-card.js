"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("card", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("card", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
    })
  }
}

"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("card", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("card", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
    })
  }
}

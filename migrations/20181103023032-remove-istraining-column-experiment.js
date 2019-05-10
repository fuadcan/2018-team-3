"use strict"

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn("experiment", "isTraining")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("experiment", "isTraining", {
      type: Sequelize.INTEGER,
      references: {
        model: "cardset",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    })
  },
}

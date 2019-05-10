"use strict"

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "cardset",
      [
        {
          name: "test",
          roundType: 1
        }
      ],
      {}
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("cardset", null, {})
  }
}

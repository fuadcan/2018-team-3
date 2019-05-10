"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transaction", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardId: {
        type: Sequelize.INTEGER,
        references: {
          model: "cards",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      roundId: {
        type: Sequelize.INTEGER,
        references: {
          model: "round",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      senderId: {
        type: Sequelize.STRING
      },
      recipientId: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM("inProgress","accepted","rejected")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("transaction")
    .then(() => queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_transaction_type"))
  }
}

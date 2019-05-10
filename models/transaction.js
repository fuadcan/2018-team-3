"use strict"
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      recipientId: DataTypes.STRING,
      senderId: DataTypes.STRING,
      cardId: {
        type: DataTypes.INTEGER,
        model: "card",
        key: "id"
      },
      roundId: {
        type: DataTypes.INTEGER,
        model: "round",
        key: "id"
      },
      type: DataTypes.ENUM("inProgress","accepted","rejected")
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "transaction",
    }
  )
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.round)
    Transaction.belongsTo(models.card)
  }
  return Transaction
}

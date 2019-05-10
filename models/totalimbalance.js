"use strict"
module.exports = (sequelize, DataTypes) => {
  const Totalimbalance = sequelize.define(
    "totalimbalance",
    {
      top: DataTypes.INTEGER,
      tsp: DataTypes.INTEGER,
      transactionId: {
        type: DataTypes.INTEGER,
        model: "transaction",
        key: "id"
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "totalimbalance",
    }
  )
  Totalimbalance.associate = function(models) {
    Totalimbalance.belongsTo(models.transaction)
  }
  return Totalimbalance
}

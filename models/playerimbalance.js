"use strict"
module.exports = (sequelize, DataTypes) => {
  const Playerimbalance = sequelize.define(
    "playerimbalance",
    {
      ow: DataTypes.INTEGER,
      ob: DataTypes.INTEGER,
      sw: DataTypes.INTEGER,
      sb: DataTypes.INTEGER,
      to: DataTypes.INTEGER,
      ts: DataTypes.INTEGER,
      transactionId: {
        type: DataTypes.INTEGER,
        model: "transaction",
        key: "id"
      },
      playerId: {
        type: DataTypes.INTEGER,
        model: "player",
        key: "id"
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "playerimbalance",
    }
  )
  Playerimbalance.associate = function(models) {
    Playerimbalance.belongsTo(models.player)
    Playerimbalance.belongsTo(models.transaction)
  }
  return Playerimbalance
}

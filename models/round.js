"use strict"

/*
Type 0 => round 1
Type 1 => round 2
Type 2 => round 3
*/

module.exports = (sequelize, DataTypes) => {
  const Round = sequelize.define(
    "round",
    {
      expId: {
        type: DataTypes.INTEGER,
        model: "experiment",
        key: "id"
      },
      cardsetId: {
        type: DataTypes.INTEGER,
        model: "cardset",
        key: "id"
      },
      length: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "round",
    }
  )
  Round.associate = function(models) {
    Round.hasMany(models.transaction)
    Round.belongsTo(models.experiment)
    Round.belongsTo(models.cardset)
  }
  return Round
}

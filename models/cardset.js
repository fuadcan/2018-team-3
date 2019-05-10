"use strict"
module.exports = (sequelize, DataTypes) => {
  const Cardset = sequelize.define(
    "cardset",
    {
      name: DataTypes.STRING,
      roundType: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "cardset",
    }
  )
  Cardset.associate = function(models) {
    Cardset.hasMany(models.card)
    Cardset.hasMany(models.round)
  }
  return Cardset
}

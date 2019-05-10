"use strict"
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define(
    "player",
    {
      username: DataTypes.STRING
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "player",
    }
  )
  Player.associate = function(models) {
    Player.belongsToMany(models.card, { through: "player_card" })
  }
  return Player
}

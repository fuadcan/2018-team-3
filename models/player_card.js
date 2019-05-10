"use strict"

module.exports = (sequelize, DataTypes) => {
  const Player_Card = sequelize.define(
    "player_card",
    {
      cardId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "card",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      playerId: {
        type: DataTypes.STRING,
        references: {
          model: "player",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "player_card",
    }
  )
  Player_Card.associate = function() {}
  return Player_Card
}

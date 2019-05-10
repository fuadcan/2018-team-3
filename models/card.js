"use strict"

module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define(
    "card",
    {
      mainValue: DataTypes.STRING,
      secondaryValue: DataTypes.STRING,
      img: DataTypes.STRING,
      cardsetId: {
        type: DataTypes.INTEGER,
        model: "cardset",
        key: "id"
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "card",
    }
  )
  Card.associate = function(models) {
    Card.belongsTo(models.cardset, {foreignKey: "cardsetId", targetKey: "id"})
    Card.belongsToMany(models.player, { through: "player_card" })
    Card.hasMany(models.transaction)
  }
  return Card
}

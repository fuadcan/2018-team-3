"use strict"
module.exports = (sequelize, DataTypes) => {
  const Experiment = sequelize.define(
    "experiment",
    {
      name: DataTypes.STRING,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "experiment",
    }
  )
  Experiment.associate = function(models) {
    Experiment.hasMany(models.round)
  }
  return Experiment
}

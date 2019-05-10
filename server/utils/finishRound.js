const db = require("../../models")
const sequelize = require("sequelize")

const finishRound = async () => {
// returns the round id and the time the round was created at
  const round = await db.sequelize
    .query("SELECT \"createdAt\", id FROM round ORDER BY id DESC LIMIT 1", {
      type: sequelize.QueryTypes.SELECT
    })

// calculates how long the round took
  const length = Math.round((Date.now() - round[0].createdAt.getTime())/60000 * 100)/100

// update the round table with the length of the round
  db.sequelize
    .query(
      "UPDATE round SET length = :length WHERE id= :round_id",
      { replacements: { round_id: round[0].id, length } },
      { type: sequelize.QueryTypes.UPDATE }
    )
    .catch(err => {
      console.log(err)
    })

  // delete players
  db.player.destroy({
    where: {},
  }).then(() => console.log("players delete"))

  // delete player_cards
  db.player_card.destroy({
    where: {},
  }).then(() => console.log("player_cards delete"))
}

module.exports = finishRound

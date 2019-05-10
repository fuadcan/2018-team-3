const express = require("express")
const router = express.Router()
const db = require("../../models/")
const sequelize = require("sequelize")

  // create a new player and add it to the database
  // when the first player joins a game, an experiment is created
  // when the fourth player joins, a round is created and cards are distributed

  router.post("/create", async (req, res) => {
      if (!req.body.username || !req.body.id) {
        return res.status(401).end()
      }

      let count = await db.sequelize.query("SELECT COUNT(*) FROM player", { type: sequelize.QueryTypes.SELECT})
      count = count[0].count

      // if there are already four players in the game, prevent them from joining
      if(count>=4){
        return res.status(401).send({message: "there are already 4 players in a game session!"}).end()
      }

      const id = req.body.id
      const username = req.body.username

      // create a new player in the database
      await db.player.create({ id, username })
      .catch((err) => {
        console.log(err)
      })

      let exp
      if (count == 0){
        await db.experiment.create({}).catch((err) => console.log(err))
      }

      exp = await db.sequelize.query("SELECT * FROM experiment order by \"createdAt\" desc limit 1;", {type: sequelize.QueryTypes.SELECT})
      const expId = exp[0].id
      req.io.emit("room", expId)

      if (count == 3){
        const cardset = await db.sequelize.query("SELECT id FROM cardset WHERE \"roundType\" = 1", {type: sequelize.QueryTypes.SELECT})
        db.round.create({
          expId: exp[0].id,
          type: 1,
          cardsetId: cardset[0].id
        })
        .catch((err) => {
          console.log(err)
        })

        // get players and assign cards to each
        const playerIds = await db.sequelize.query("SELECT id, username FROM player", {type: sequelize.QueryTypes.SELECT})
        const cardsForRound = await db.sequelize.query("SELECT id, img FROM Card WHERE \"cardsetId\"= :cardsetId ORDER BY \"mainValue\" ", {replacements: {cardsetId:cardset[0].id}}, {type: sequelize.QueryTypes.SELECT})

        cardsForRound[0].map(({id},index) => {
          db.player_card.create({
            cardId:id,
            playerId: playerIds[index % playerIds.length].id
          })
          .catch((err) => {
            console.log(err)
          })
        })
        req.io.emit("start", playerIds)
      }

      const players = await db.sequelize.query("SELECT id, username FROM player", {type: sequelize.QueryTypes.SELECT})
      return res.status(200).send({players}).end()
  })

module.exports = router

const express = require("express")
const router = express.Router()
const sequelize = require("sequelize")
const json2csv = require("json2csv").parse
const db = require("../../models")

// router.post("/importCard", function(req, res) {
//     if (!req.body) {
//       return res.status(401).end()
//     }

//   db.card.create({
//       mainValue: req.body.mainValue,
//       secondValue: req.body.secondValue,
//       //img: req.body.img,
//       cardset: req.body.cardset
//     }).then(() => {
//         // edit card for the card set
//         return res.status(200).end()
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   })

router.delete("/deleteCard", function (req, res) {
  if (!req.body.id) {
    return res.status(401).end()
  }
  db.card.destroy({
    id: req.body.id
  }).then(() => {
    // delete card from card set
    return res.status(200).end()
  })
    .catch((err) => {
      console.log(err)
    })
})
router.get("/pullCards/:cardset", async function (req, res) {
  if (!req.params.cardset) {
    return res.status(401).end()
  }
  const { cardset } = req.params
  // For now just retrieve all cards in the db. Future implementation, retrieve only the the cards for a specific round by passing that in and joing on cardset table
  const cards = await db.sequelize.query("SELECT * FROM card where \"cardsetId\"=:cardset", { replacements: { cardset } }, { type: sequelize.QueryTypes.SELECT })
    .then((cards) => {
      return cards[0]
    })
    .catch((err) => {
      console.log(err)
    })
  return res.status(200).send({ cards }).end()
})

const SQL = "select transaction.id, transaction.\"roundId\", transaction.\"senderId\", transaction.\"recipientId\", transaction.type, transaction.\"createdAt\", transaction.\"updatedAt\", transaction.\"cardId\", card.\"mainValue\", card.\"secondaryValue\", card.img, cardset.name as \"cardsetName\", cardset.id as \"cardsetId\" from transaction inner join card on card.id = transaction.\"cardId\" inner join cardset on cardset.id = card.\"cardsetId\" order by transaction.id asc;"

// gets the data from transactions table and exports it to csv
router.get("/export", async function (req, res) {
  const data = await db.sequelize.query(SQL,
    { type: sequelize.QueryTypes.SELECT })
    .catch((err) => {
      console.log(err)
    })

  const fields = ["id", "roundId", "senderId", "recipientId", "type", "createdAt", "updatedAt", "cardId", "mainValue", "secondaryValue", "img", "cardsetId", "cardsetName"]
  let csv
  try {
    csv = json2csv(data, { fields })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err })
  }

  db.sequelize.query("DELETE from player_card", { type: sequelize.QueryTypes.delete })
  db.sequelize.query("DELETE from experiment", { type: sequelize.QueryTypes.delete })
  db.sequelize.query("DELETE from round", { type: sequelize.QueryTypes.delete })
  db.sequelize.query("DELETE from player", { type: sequelize.QueryTypes.delete })
  db.sequelize.query("DELETE from transaction", { type: sequelize.QueryTypes.delete })

  res.setHeader("Content-disposition", "attachment; filename=card_experiment_data.csv")
  res.set("Content-Type", "text/csv")
  res.status(200).send(csv)
})

module.exports = router

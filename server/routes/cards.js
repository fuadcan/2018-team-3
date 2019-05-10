const express = require("express")
const router = express.Router()
const db = require("../../models")
const sequelize = require("sequelize")
const createCard = require("../utils/createCards")
const finishRound = require("../utils/finishRound")
const { NUM_CARDS_IN_CARDSET, IN_PROGRESS } = require("../utils/constants")

// create a new card set with cards
router.post("/create", function (req, res) {
  if (!req.body) {
    return res.status(401).end()
  }
  const { cards } = req.body
  db.cardset.create({
    roundType: 1 // TOOD: finalize type for cardset
  }).then((cardset) => {
    const cardsetId = cardset.get("id")
    for (let i = 0; i < cards.length; i++) {
      createCard(cardsetId, cards[i].url, cards[i].primaryValue, cards[i].secondaryValue)
    }
    return res.status(200).end()
  })
    .catch(err => {
      console.log(err)
      res.status(401).send({ message: "cardset creation error" })
    })

  return res.status(200).end()

})


// router for requesting a trade to a recipient
router.post("/request-trade", async (req, res) => {
  if (!req.body) {
    return res.status(401).end()
  }

  const { senderId, recipientId, cardId } = req.body
  const round = await db.sequelize.query("SELECT MAX(id) as id from round", { type: sequelize.QueryTypes.SELECT })

  // create a transaction
  const transaction = await db.transaction.create({
    type: "inProgress",
    cardId,
    senderId: senderId,
    recipientId: recipientId,
    roundId: round[0].id
  })
    .catch(err => {
      console.log(err)
      res.status(401).send({ message: "transaction creation error" })
    })

  const transactionId = transaction.dataValues.id

  const card = await db.sequelize.query("SELECT id, img from card where id=:id limit 1", { replacements: { id: cardId } }, { type: sequelize.QueryTypes.SELECT })
    .then(card => card[0])
    .catch((err) => { console.log(err) })

  // send socket to recipient with a transaction
  if (!req.io.sockets.connected[recipientId]) {
    return res.status(401).send({ message: "recipientId not found" })
  }

  req.io.sockets.connected[recipientId].emit("recieve", { card: card[0], senderId, transactionId })
  // send progress status to all players
  req.io.emit("isPendingTransaction", true)
  return res.status(200).end()
})

// accept a trade from a sender
router.post("/accept-trade", async (req, res) => {
  if (!req.body) {
    return res.status(401).end()
  }
  const { transactionId } = req.body

  const transaction = await db.sequelize.query("SELECT * from transaction where id = :transactionId", { replacements: { transactionId } }, { type: sequelize.QueryTypes.SELECT })
    .then(transaction => transaction[0])
    .catch((err) => {
      console.log(err)
      return res.status(404).send({ message: "cannot find transaction" })
    })

  const { id, type, recipientId, senderId, cardId } = transaction[0]

  if (type !== IN_PROGRESS) {
    return res.status(401).send({ message: "transaction is no longer in progress" })
  }

  // update transaction type
  await db.sequelize.query("UPDATE transaction SET type = 'accepted' WHERE id= :id", { replacements: { id } }, { type: sequelize.QueryTypes.SELECT })
    .catch((err) => {
      console.log(err)
      return res.status(401).send({ message: "could not accept transaction" })
    })

  // update player_card for recipient
  await db.sequelize.query("UPDATE player_card SET \"playerId\" = :recipientId WHERE \"cardId\" = :cardId", { replacements: { recipientId, cardId } }, { type: sequelize.QueryTypes.SELECT })
    .catch((err) => {
      console.log(err)
      return res.status(401).send({ message: "cannot update player_card" })
    })

  // send socket to recipient with a transaction
  if (!req.io.sockets.connected[recipientId]) {
    return res.status(401).send({ message: "recipientId not found" })
  }

  req.io.sockets.connected[senderId].emit("transactionAccepted", { recipientId, cardId })
  req.io.emit("isPendingTransaction", false)

  // TODO: calculate inbalance calculations

  // TODO: maybe return new array of cards
  return res.status(200).end()
})

// reject a trade from a sender
router.post("/reject-trade", async (req, res) => {
  if (!req.body) {
    return res.status(401).end()
  }

  // THERE SHOULD BE ONLY ONE TRANSACTION THAT IS IN PROGRESS WITH CARD ID
  // IN THE FUTURE, WE CAN USE TRANSACTION ID
  const { transactionId } = req.body

  const transaction = await db.sequelize.query("SELECT * from transaction where id = :transactionId", { replacements: { transactionId } }, { type: sequelize.QueryTypes.SELECT })
    .then(transaction => transaction[0])
    .catch((err) => {
      console.log(err)
      return res.status(404).send({ message: "cannot find transaction" })
    })

  const { id, cardId, type, recipientId, senderId } = transaction[0]

  if (type !== IN_PROGRESS) {
    return res.status(401).send({ message: "transaction is no longer in progress" })
  }

  // update transaction type
  await db.sequelize.query("UPDATE transaction SET type = 'rejected' WHERE id= :id", { replacements: { id } }, { type: sequelize.QueryTypes.SELECT })
    .catch((err) => {
      console.log(err)
      return res.status(401).send({ message: "could not reject transaction" })
    })

  const card = await db.sequelize.query("SELECT id, img from card where id=:id limit 1", { replacements: { id: cardId } }, { type: sequelize.QueryTypes.SELECT })
    .then(card => card[0])
    .catch((err) => { console.log(err) })

  req.io.sockets.connected[senderId].emit("transactionRejected", { recipientId, card: card[0] })
  req.io.emit("isPendingTransaction", false)

  return res.status(200).end()
})


// Checks if the game has been completed by checking the cards of each player
router.get("/isComplete", async (req, res) => {
  // Grab all the cards each player has from the DB
  const playerCards = await db.sequelize
    .query(
      "SELECT player_card.\"playerId\", card.\"mainValue\" FROM player_card INNER JOIN card ON player_card.\"cardId\" = card.id",
      { type: sequelize.QueryTypes.SELECT }
    )
    .catch(err => {
      console.log(err)
    })

  // this object will help manage who has which card
  const cardToPlayerMapping = {}
  console.log(playerCards[0])
  for (let i = 0; i < playerCards.length; i++) {
    const { playerId, mainValue } = playerCards[i]

    //check if my cardToPlayerMapping object already contains the main value, i.e, A,B,C,D
    if (cardToPlayerMapping.hasOwnProperty(mainValue)) {
      const player = cardToPlayerMapping[mainValue]
      //checks to see if the owner of the card we're currently at is the same owner as the other cards with the same main value
      if (player != playerId) {
        // if two different players share cards with the same MainValue, return false
        req.io.emit("isRoundComplete", false)
        return res.status(200).end()
      }
    } else {
      // Add the mainValue to the cardToPlayerMapping object along with the playerId that has that card
      cardToPlayerMapping[mainValue] = playerId
    }
  }

  finishRound() // util method to do some stuff

  req.io.emit("isRoundComplete", true)
  return res.status(200).end()
})

// get cards for a specific player
router.get("/:playerId", async (req, res) => {
  if (!req.params) {
    return res.status(401).end()
  }

  const { playerId } = req.params

  const cards = await db.sequelize.query("SELECT player_card.\"cardId\", card.img FROM player_card INNER JOIN card ON player_card.\"cardId\" = card.id WHERE player_card.\"playerId\" = :playerId", { replacements: { playerId: playerId } }, { type: sequelize.QueryTypes.SELECT })
    .then(card => card[0])
    .catch((err) => {
      console.log(err)
    })

  return res.status(200).send(cards).end()
})

module.exports = router

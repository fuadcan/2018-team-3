const db = require("../../models")

const createCard = async (cardsetId, img, mainValue, secondaryValue) => {
    db.card.create({
      cardsetId, img, mainValue, secondaryValue
    }).then(card => {
      return card
    }).catch(err => {
      console.log(err)
    })
}

module.exports = createCard

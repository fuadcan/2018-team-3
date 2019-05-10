import axios from "axios";
import FirebaseImageUpload, { getFirebaseImages } from "./FirebaseImageUpload";

export const constants = {
  DELETE_CARD: "DELETE_CARD",
  IMPORT_CARD: "IMPORT_CARD",
  EXPORT_EXPERIMENT: "EXPORT_EXPERIMENT",
  SUBMIT_ADMIN_CARDS: "SUBMIT_ADMIN_CARDS",
  CREATE_EMPTY_CARDSET_ARRAY: "CREATE_EMPTY_CARDSET_ARRAY",
  ADD_CARD_TO_CARDSET: "ADD_CARD_TO_CARDSET",
  CHOOSE_CARDS_FOR_EXPERIMENT: "CHOOSE_CARDS_FOR_EXPERIMENT",
  SET_CARDS1: "SET_CARDS1",
  SET_CARDS2: "SET_CARDS2",
  SET_CARDS3: "SET_CARDS3",
};

export const initialState = {
  cardSet: {
    cardSet1: {
      name: "cardSet1",
      cards: []
    },
    cardSet2: {
      name: "cardSet2",
      cards: []
    },
    cardSet3: {
      name: "cardSet3",
      cards: []
    }
  },
  cardSetChosenForExperiment: "",
  defaultTabIndex: 0
};

const fetchCards = () => {
  axios
    .get(`/admin/pullCards/1`, {
    })
    .then(function (response) {
      // console.log("RESPONSE CARDS", response.data.cards)
      // cardSet1Cards = response.data.cards
      return response.data.cards
    })
    .catch(function (error) {
      console.log(error);
    })
}

const modifiedCardsArray = cards => {
  const uploadedImages = FirebaseImageUpload(cards)
  let fullCardObjects
  setTimeout(() => {
    fullCardObjects = getFirebaseImages(uploadedImages)
    setTimeout(() => {
      console.log("Full card object", fullCardObjects)
      axios
        .post("/cards/create", {
          cards: fullCardObjects
        })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        });
    }, 2000)
  }, 3000)
};

// If the user chooses card set for an experiment or modifies the card
// The whole card selection page will be re-rendered
// Need to capture on which tab it was saved and pass it as a default index for tabs

export default function AdminReducer(state, action) {
  switch (action.type) {
    case constants.SET_CARDS1: {
      const { cardSet } = state
      const { name } = state.cardSet.cardSet1
      let cards = action.cards1
      if (action.cards1 === undefined) {
        cards = Array.from({ length: 8 }, () => ({
          secondaryValue: "",
          primaryValue: "",
          imageUrl: ""
        }));
      }
      return Object.assign({}, state, {
        cardSet: {
          ...cardSet,
          cardSet1: {
            name,
            cards: cards
          }
        }
      });
    }
    case constants.SET_CARDS2: {
      const { cardSet } = state
      const { name } = state.cardSet.cardSet2
      let cards = action.cards2
      if (action.cards2.length === 0) {
        cards = Array.from({ length: 8 }, () => ({
          secondaryValue: "",
          primaryValue: "",
          imageUrl: ""
        }));
      }
      return Object.assign({}, state, {
        cardSet: {
          ...cardSet,
          cardSet2: {
            name,
            cards: cards
          }
        }
      });
    }
    case constants.SET_CARDS3: {
      const { cardSet } = state
      const { name } = state.cardSet.cardSet3
      let cards = action.cards3
      if (action.cards3.length === 0) {
        cards = Array.from({ length: 8 }, () => ({
          secondaryValue: "",
          primaryValue: "",
          imageUrl: ""
        }));
      }
      return Object.assign({}, state, {
        cardSet: {
          ...cardSet,
          cardSet3: {
            name,
            cards: cards
          }
        }
      });
    }
    case constants.CHOOSE_CARDS_FOR_EXPERIMENT: {
      const { cardSetName } = action;
      return Object.assign({}, state, {
        cardSetChosenForExperiment: cardSetName,
        defaultTabIndex: parseInt(
          cardSetName.charAt(cardSetName.length - 1) - 1
        )
      });
    }
    case constants.ADD_CARD_TO_CARDSET: {
      const cardSetArray = Array.from(
        state.cardSet[action.card.cardSetName].cards
      );
      cardSetArray[action.id] = action.card;
      const { cardSet } = state;
      return Object.assign({}, state, {
        cardSet: {
          ...cardSet,
          [action.card.cardSetName]: {
            cards: cardSetArray
          }
        },
        defaultTabIndex: parseInt(
          action.card.cardSetName.charAt(action.card.cardSetName.length - 1) - 1
        )
      });
    }
    case constants.CREATE_EMPTY_CARDSET_ARRAY: {
      const cardSetArray = Array.from({ length: 8 }, () => ({
        secondaryValue: "",
        primaryValue: "",
        imageUrl: ""
      }));
      const { cardSet } = state;
      return Object.assign({}, state, {
        cardSet: {
          ...cardSet,
          [action.cardSetName]: {
            cards: cardSetArray
          }
        }
      });
    }
    case constants.SUBMIT_ADMIN_CARDS: {
      modifiedCardsArray(state.cardSet.cardSet1.cards)
      // call import_Card reducer
      return state;
    }
    case constants.DELETE_CARD: {
      axios
        .delete(`/admin/deleteCard`, {
          Card_Id: 1
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      return Object.assign({}, state, {});
    }
    case constants.IMPORT_CARD: {
      const { cards } = state;

      return Object.assign({}, state, {});
    }
    case constants.EXPORT_EXPERIMENT: {
      axios
        .get(`/admin/exportExperiment`, {
          experiment: 1
        })
        .then(function (response) {
          console.log(response);
        })
        .then(function (error) {
          console.log(error);
        });
      return state;
    }
  }
}

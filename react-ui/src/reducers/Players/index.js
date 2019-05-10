import axios from "axios"

export const constants = {
  ACCEPT: "ACCEPT",
  REJECT: "REJECT",
  MAIN_PLAYER: "MAIN_PLAYER",
  SECOND_PLAYER: "SECOND_PLAYER",
  THIRD_PLAYER: "THIRD_PLAYER",
  FOURTH_PLAYER: "FOURTH_PLAYER",
  CARDS_REORDER: "CARDS_REODER",
  MERGE_CARDS: "MERGE_CARDS",
  MOVE_CARDS: "MOVE_CARDS",
  DEFAULT: "DEFAULT",
  UPDATE_TRANSACTION_PROGRESS: "UPDATE_TRANSACTION_PROGRESS",
  RECEIVE_TRANSACTION: "RECEIVED_TRANSACTION",
  TRANSACTION_ACCEPTED: "TRANSACTION_ACCEPTED",
  TRANSACTION_REJECTED: "TRANSACTION_REJECTED",
  SET_SESSION_ID: "SET_SESSION_ID",
  CREATE_PLAYER: "CREATE_PLAYER",
  BEGIN_GAME: "BEGIN_GAME",
  ASSIGN_PLAYERS: "ASSIGN_PLAYERS",
  SHOW_ROUND_COMPLETE_MODAL: "SHOW_ROUND_COMPLETE_MODAL",
  CONTINUE_GAME: "CONTINUE_GAME",
  CLEAR_GAME: "CLEAR_GAME",
}

export const initialState = {
  mainPlayer: {
    id: null,
    cards: []
  },
  secondPlayer: {
    id: null,
    card: {},
  },
  thirdPlayer: {
    id: null,
    card: {},
  },
  fourthPlayer: {
    id: null,
    card: {},
  },
  gameStart: false,
  sessionId: null,
  user: null,
  isPendingTransaction: false,
  showTradeBtn: false,
  roundCompleteModal: {
    showModal: false,
    isRoundComplete: null,
  },
}

function createPlayer(id, username) {
  let result
  axios({
    method: "POST",
    url: "/players/create",
    data: { id, username },
    config: { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  }).then((response) => {
    return response.data
  }).catch((err) => {
    console.debug(err)
  })

  return result
}

export default function playersReducer(state, action) {
  switch (action.type) {
    case constants.CREATE_PLAYER: {
      if (state.sessionId == null) {
        console.debug("something went wrong")
        return
      }
      const id = state.sessionId
      const username = action.username
      createPlayer(id, username)

      return Object.assign({}, state, {
        user: {
          id: state.sessionId,
          username: action.username
        },
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          id: state.sessionId,
          username: action.username
        },
      })
    }
    case constants.DEFAULT: {
      const mainPlayerCardsDup = Array.from(state.mainPlayer.cards)
      const [removedCard] = mainPlayerCardsDup.splice(action.startIndex, 1)

      return Object.assign({}, state, {
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          cards: mainPlayerCardsDup
        },
        [`${action.toPlayer}Player`]: {
          ...state[`${action.toPlayer}Player`],
          card: removedCard,
        },
      })
    }
    case constants.BEGIN_GAME: {
      return Object.assign({}, state, {
        gameStart: true,
      })
    }

    case constants.SET_SESSION_ID: {
      return Object.assign({}, state, {
        sessionId: action.id
      })
    }
    case constants.CARDS_REORDER: {
      const tempArray = Array.from(state.mainPlayer.cards)
      const [removed] = tempArray.splice(action.startIndex, 1)
      tempArray.splice(action.destinationIndex, 0, removed)
      return Object.assign({}, state, {
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          cards: tempArray,
        }
      })
    }
    case constants.RECEIVE_TRANSACTION: {
      const { id, img } = action.card
      return Object.assign({}, state, {
        [`${action.fromPlayer}Player`]: {
          ...state[`${action.fromPlayer}Player`],
          card: {
            img,
            cardId: id,
            transactionId: action.transactionId,
          },
        },
        showTradeBtn: true,
      })
    }
    case constants.ACCEPT: {
      const mainPlayerCardsDup = Array.from(state.mainPlayer.cards)
      mainPlayerCardsDup.splice(0, 0, action.card)
      return Object.assign({}, state, {
        [`${action.fromPlayer}Player`]: {
          ...state[`${action.fromPlayer}Player`],
          card: {}
        },
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          cards: mainPlayerCardsDup
        },
        showTradeBtn: false,
      })
    }
    case constants.REJECT: {
      return Object.assign({}, state, {
        [`${action.fromPlayer}Player`]: {
          ...state[`${action.fromPlayer}Player`],
          card: {}
        },
        showTradeBtn: false,
      })
    }
    case constants.TRANSACTION_ACCEPTED: {
      return Object.assign({}, state, {
        [`${action.fromPlayer}Player`]: {
          ...state[`${action.fromPlayer}Player`],
          card: {}
        },
      })
    }
    case constants.TRANSACTION_REJECTED: {
      const mainPlayerCardsDup = Array.from(state.mainPlayer.cards)
      mainPlayerCardsDup.splice(0, 0, action.card)
      return Object.assign({}, state, {
        [`${action.fromPlayer}Player`]: {
          ...state[`${action.fromPlayer}Player`],
          card: {}
        },
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          cards: mainPlayerCardsDup,
        },
      })
    }
    case constants.UPDATE_TRANSACTION_PROGRESS: {
      return Object.assign({}, state, {
        isPendingTransaction: action.isPendingTransaction
      })
    }
    case constants.MERGE_CARDS: {
      const cards = action.cards
      return Object.assign({}, state, {
        ["mainPlayer"]: {
          ...state["mainPlayer"],
          cards,
        },
      })
    }
    // assign ids and usernames to the other players state
    case constants.ASSIGN_PLAYERS: {
      const players = action.players
      return Object.assign({}, state, {
        ["secondPlayer"]: {
          id: players[0].id,
          username: players[0].username,
          card: {},
        },
        ["thirdPlayer"]: {
          id: players[1].id,
          username: players[1].username,
          card: {},
        },
        ["fourthPlayer"]: {
          id: players[2].id,
          username: players[2].username,
          card: {},
        },
      })
    }

    case constants.SHOW_ROUND_COMPLETE_MODAL: {
      const isRoundComplete = action.isRoundComplete
      return Object.assign({}, state, {
        isPendingTransaction: true,
        roundCompleteModal: {
          showModal: true,
          isRoundComplete,
        },
      })
    }

    case constants.CONTINUE_GAME: {
      return Object.assign({}, state, {
        isPendingTransaction: false,
        roundCompleteModal: {
          showModal: false,
          isRoundComplete: null,
        },
      })
    }

    case constants.CLEAR_CARDS: {
      return Object.assign({}, state, {
        mainPlayerCards: []
      })
    }

    case constants.CLEAR_GAME: {
      return initialState
    }

    default: return state
  }
}

import React from "react"
import io from "socket.io-client"
import axios from "axios"

// components && containers
import AdminLoginPage from "containers/Admin/LoginPage"
import AdminExportCSV from "containers/Admin/ExportCSV"
import LandingPage from "containers/LandingPage"
import CardSelectionPage from "containers/Admin/CardSelectionPage"

// utils
import { MalibuSprites } from "@heroku/react-malibu"
import { compose, withState, withHandlers, withReducer, lifecycle, shouldUpdate } from "recompose"
import { DragDropContext } from "react-beautiful-dnd"
import { getFromPlayerFromId } from "./helpers"
import { auth } from "./firebase"

import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom"

// players reducers
import playersReducer, {
  constants as playersConstants,
  initialState as playersInitialState
} from "./reducers/Players"

import { constants as adminConstants } from "reducers/Admin"

//admin reducer
import adminReducer, { initialState as adminInitialState } from "./reducers/Admin"

const socket = io()

function PrivateRoute({ component, adminUser, pathname, ...rest }) {
  const Component = component
  return (
    <Route
      {...rest}
      render={(props) => (localStorage.getItem("adminLoggedIn")
        ? <Component {...rest} />
        : <Redirect
          to={{
            pathname: (rest.redirectTo ? rest.redirectTo : '/admin/login'),
            state: { returnTo: pathname },
          }}
        />
      )}
    />
  )
}

function App(props) {
  console.log(props.isLoggedIn)
  return (
    <DragDropContext onDragEnd={props.handleDragEnd}>
      <MalibuSprites />
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/admin/exportcsv" adminUser={props.adminUser} component={AdminExportCSV} {...props} />
          <PrivateRoute exact path="/admin/cards" adminUser={props.adminUser} component={CardSelectionPage} {...props} />
          <Route exact path="/admin/login" component={(restProps) => <AdminLoginPage {...props} {...restProps} />} />
          <Route exact path="/" component={() => <LandingPage {...props} />} />
        </Switch>
      </BrowserRouter>
    </DragDropContext>
  )
}

export default compose(
  withReducer("state", "dispatch", playersReducer, playersInitialState),
  withReducer("adminState", "adminDispatch", adminReducer, adminInitialState),
  withState("isLoggedIn", "setIsLoggedIn", false),
  withState("adminUser", "setAdminUser"),
  withHandlers({
    adminUserSignOut: (props) => () => {
      auth.signOut()
        .then(() => {
          localStorage.setItem("adminLoggedIn", false)
        })
    },
    handleDragEnd: (props) => (dragProps) => {
      const { destination, draggableId, source } = dragProps
      if (!destination) return
      // the player re-orders the cards (doesn't drop to another players droppables)
      if (destination.droppableId === source.droppableId) {
        props.dispatch({
          type: playersConstants.CARDS_REORDER,
          startIndex: source.index,
          destinationIndex: destination.index,
        })
      } else {
        const toPlayer = destination.droppableId.split("_")[0].toLowerCase()
        props.dispatch({
          type: playersConstants.DEFAULT,
          startIndex: source.index,
          destinationIndex: destination.index,
          fromPlayer: source.droppableId.split("_")[0].toLowerCase(),
          toPlayer: destination.droppableId.split("_")[0].toLowerCase()
        })

        socket.emit("pending", true)
        axios({
          method: "POST",
          url: "/cards/request-trade",
          data: {
            cardId: draggableId,
            senderId: props.state.user.id,
            recipientId: props.state[`${toPlayer}Player`].id,
          },
          config: { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        }).then(() => {
          //TODO: add loading indicator
        }).catch((err) => {
          console.debug(err)
        })
      }
    },
  }),
  lifecycle({
     async componentDidMount() {
      const { dispatch } = this.props
      socket.on("connect", () => {
        const id = socket.id

        dispatch({ type: playersConstants.SET_SESSION_ID, id })
        socket.emit("hi", id)

        socket.on("message", (id) => {
          console.log("sessionId: ", id)
        })

        socket.on("room", (expId) => {
          socket.emit("room", expId, this.props.state.sessionId)
        })

        socket.on("isPendingTransaction", (isPendingTransaction) => {
          dispatch({
            type: playersConstants.UPDATE_TRANSACTION_PROGRESS,
            isPendingTransaction
          })
        })

        // your pending transaction has been accepted
        // remove it from the otherplayersDroppable
        socket.on("transactionAccepted", ({ recipientId, cardId }) => {
          const fromPlayer = getFromPlayerFromId(this.props.state, recipientId)
          dispatch({
            type: playersConstants.TRANSACTION_ACCEPTED,
            fromPlayer,
            cardId
          })
        })

        socket.on("isRoundComplete", (isRoundComplete) => {
          dispatch({
            type: playersConstants.SHOW_ROUND_COMPLETE_MODAL,
            isRoundComplete,
          })
        })

        // your pending transaction has been rejected
        // put it back in your cardset
        socket.on("transactionRejected", ({ recipientId, card }) => {
          const fromPlayer = getFromPlayerFromId(this.props.state, recipientId)
          dispatch({
            type: playersConstants.TRANSACTION_REJECTED,
            fromPlayer,
            card: {
              cardId: card.id,
              img: card.img
            }
          })
        })


        socket.on("recieve", ({ card, senderId, transactionId }) => {
          const fromPlayer = getFromPlayerFromId(this.props.state, senderId)
          dispatch({
            type: playersConstants.RECEIVE_TRANSACTION,
            fromPlayer,
            card,
            transactionId,
          })
        })

        /*
        The server will emit a "start" message once all 4 players have
        joined the game with an object of playerIds. Once we get all the
        cards for the specific user, we will dispatch an action to assign
        cards to players, assign player ids and usernames to the reducer state
        and dispatch an action to begin the game.
        */
        socket.on("start", (playerIds) => {
          const { sessionId } = this.props.state
          const players = playerIds.filter(player => player.id !== sessionId)
          axios({
            method: "GET",
            url: `/cards/${sessionId}`,
            data: {},
            config: { headers: { "Content-Type": "application/json; charset=utf-8" } }
          }).then((response) => {
            const cards = response.data
            dispatch({ type: playersConstants.ASSIGN_PLAYERS, players })
            dispatch({ type: playersConstants.MERGE_CARDS, cards })
            dispatch({ type: playersConstants.BEGIN_GAME })
          }).catch((err) => {
            console.debug(err)
          })
        })
      })
      let cards1 = []
      let cards2 = []
      let cards3 = []

      await axios
        .get(`/admin/pullCards/1`, {
        })
        .then(async function (response) {
          console.log("response", response.data.cards)
          cards1 = await response.data.cards
        })
        .catch(function (error) {
        })
      this.props.adminDispatch({ type: adminConstants.SET_CARDS1, cards1 })
      // setting the observable for auth state changes
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.props.setAdminUser(user)
        }
      })

      await axios
        .get(`/admin/pullCards/2`, {
        })
        .then(async function (response) {
          console.log("CARDS 2", response.data)
          cards2 = await response.data.cards
        })
        .catch(function (error) {
        })
      this.props.adminDispatch({ type: adminConstants.SET_CARDS2, cards2 })
      // setting the observable for auth state changes
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.props.setAdminUser(user)
        }
      })

      await axios
        .get(`/admin/pullCards/3`, {
        })
        .then(async function (response) {
          cards3 = await response.data.cards
        })
        .catch(function (error) {
        })
      this.props.adminDispatch({ type: adminConstants.SET_CARDS3, cards3 })
      // setting the observable for auth state changes
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.props.setAdminUser(user)
        }
      })
    },
  }),

  shouldUpdate((props, nextProps) => {
    if ((!props.state.user) && !!nextProps.state.user) {
      localStorage.setItem("isLoggedIn", true)
      nextProps.setIsLoggedIn(true)
    }
    return true
  }),
)(App)

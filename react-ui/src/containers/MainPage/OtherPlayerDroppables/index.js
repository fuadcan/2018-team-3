import React from "react"
import { Droppable } from "react-beautiful-dnd"
import { constants as playersConstants } from "reducers/Players"
import axios from "axios"

import Card from "components/Card"
import "./styles.css"
import DragIcon from "assets/drag_icon.png"

// droppable bin styling
const getListStyle = (snapshot, cardFromPlayer) => {
  const height =  snapshot.isDraggingOver ? 185*1.2 : 185
  const width =  snapshot.isDraggingOver ? 250*1.2 : 250

  return ({
    position: "relative",
    backgroundColor: snapshot.isDraggingOver ? "#edeff7" : "white",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,.2)",
    height: cardFromPlayer ? "auto" : height,
    width: cardFromPlayer ? "auto" : width,
    border: cardFromPlayer ? "none" : "1.5px dashed #a7a7a7",
  })
}

// drag and drop watermark icon styling
const getImageStyle = (isDraggingOver) => {
  const height =  isDraggingOver ? 185*1.2 : 185
  const width =  isDraggingOver ? 250*1.2 : 250
  return ({
    position: "absolute",
    opacity: 0.1,
    top: `calc(${height}px - 25px - 50%)`,
    left: `calc(${width}px - 25px - 50%)`,
  })
}

const handleTransactionRequest = (props, val, type) => {
  const { dispatch } = props
  const { card, playerNumber } = val
  const { transactionId } = card
  if (!transactionId) {
    return
  }
  axios({
    method: "POST",
    url: `/cards/${type.toLowerCase()}-trade`,
    data: { transactionId },
    config: { headers: {"Content-Type": "application/x-www-form-urlencoded" }}
  }).then(() => {
    dispatch({ type, fromPlayer: playerNumber, card: val.card })
  }).catch((err) => {
    console.debug(err)
  })
}

export default function OtherPlayerDroppables(props) {
  const { secondPlayer, thirdPlayer, fourthPlayer } = props.state
  return <div className="absolute w-100 otherPlayerDroppables">
    <div className="flex justify-center">
      {
        [{ droppableId: playersConstants.SECOND_PLAYER, playerNumber: "second", card: secondPlayer.card, username: secondPlayer.username },
        { droppableId: playersConstants.THIRD_PLAYER, playerNumber: "third", card: thirdPlayer.card, username: thirdPlayer.username },
        { droppableId: playersConstants.FOURTH_PLAYER, playerNumber: "fourth", card: fourthPlayer.card, username: fourthPlayer.username }].map((val, index) => {
          const cardFromPlayer = Object.keys(val.card).length !== 0
          return(
            <div key={index} className="ma3">
              <div className="b tc f3 mb3"> {val.username} </div>
              <Droppable droppableId={val.droppableId} className="droppableBin">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot, cardFromPlayer)}
                    {...provided.droppableProps}
                  >
                    <img className="dragIcon" style={getImageStyle(snapshot.isDraggingOver)} src={DragIcon} height="50" />
                    {cardFromPlayer && (<Card key={val.card.cardId} value={val.card.img} />)}
                  </div>
                )}
              </Droppable>
                { (props.state.showTradeBtn && cardFromPlayer) &&
                  <div className="actionBtns-container tc pt2 outline-0">
                    <button
                     className="denyBtn actionBtns outline-0"
                     onClick={() => handleTransactionRequest(props, val, playersConstants.REJECT)}
                   >
                     reject
                   </button>
                    <button
                      className="acceptBtn ml1 actionBtns outline-0"
                      onClick={() => handleTransactionRequest(props, val, playersConstants.ACCEPT)}
                    >
                      accept
                    </button>
                  </div>
                }
              </div>
          )})
        }
    </div>
  </div>
}

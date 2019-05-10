import React from "react"
import { compose, withState, lifecycle } from "recompose"
import { Droppable, Draggable } from "react-beautiful-dnd"
import OtherPlayerDroppables from "./OtherPlayerDroppables"
import axios from "axios"
import {HKModal} from "@heroku/react-hk-components"

// components
import Card from "components/Card"
import Header from "components/Header"
import "./styles.css"

import { constants as playersConstants } from "reducers/Players"

import "../../index.css"

function MainPage(props) {
  const checkForRoundComplete = () => {
    axios
      .get("/cards/isComplete")
      .catch(error => {
        console.log(error)
      })
  }

  const { state } = props
  const { showModal, isRoundComplete } = state.roundCompleteModal
  const loading = (<div className="load">The game will start shortly!<br /> <span style={{ color: " slategray", fontSize: "18px", fontWeight: "bold" }}>waiting for other players to login</span></div>)
  const loader = (<div className="flex justify-center loader" id="loader"></div>)
                  
  const cards = state.mainPlayer.cards
  const text = isRoundComplete ? "Head back to login page" : "Head back to the game"
  // const cards = [{
  //     mainValue: "A",
  //     secondaryValue: "E",
  //     cardId: 1,
  //     img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide1.png?alt=media&token=e41a6a8e-ad24-4604-8514-e9d03ed2d5ee&fbclid=IwAR3do655ZLGZe_LTXLOpYfvv7gS97jhWhFGGUfQK5tCtWYLmVaep5dXWfQ8"
  //   },
  //   {
  //     mainValue: "A",
  //     secondaryValue: "F",
  //     cardId: 2,
  //     img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide1.png?alt=media&token=e41a6a8e-ad24-4604-8514-e9d03ed2d5ee&fbclid=IwAR3do655ZLGZe_LTXLOpYfvv7gS97jhWhFGGUfQK5tCtWYLmVaep5dXWfQ8"
  //   },
  //   {
  //     mainValue: "A",
  //     secondaryValue: "G",
  //     cardId: 3,
  //     img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide1.png?alt=media&token=e41a6a8e-ad24-4604-8514-e9d03ed2d5ee&fbclid=IwAR3do655ZLGZe_LTXLOpYfvv7gS97jhWhFGGUfQK5tCtWYLmVaep5dXWfQ8"
  //   },
  //   {
  //     mainValue: "A",
  //     secondaryValue: "H",
  //     cardId: 4,
  //     img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide1.png?alt=media&token=e41a6a8e-ad24-4604-8514-e9d03ed2d5ee&fbclid=IwAR3do655ZLGZe_LTXLOpYfvv7gS97jhWhFGGUfQK5tCtWYLmVaep5dXWfQ8"
  //   }
  // ]

  // if (true) {
  if (state.gameStart && state.mainPlayer.cards) {
    return (
      <React.Fragment>
        <Header gameStart={state.gameStart} isPendingTransaction={state.isPendingTransaction} handleGameDone={checkForRoundComplete} textToDisplay={`Hi ${state.mainPlayer.username}!`} />
        <div className="mainPage relative">
          <OtherPlayerDroppables {...props} />
          <Droppable droppableId={playersConstants.MAIN_PLAYER} direction="horizontal" ignoreContainerClipping={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                style={{ paddingTop: "15%" }}
                className="flex justify-center items-center h-100"
              >
                {
                  cards.map((item, index) => (
                    <Draggable
                      isDragDisabled={state.isPendingTransaction ? true : false}
                      key={item.cardId}
                      draggableId={item.cardId}
                      index={index}
                    >

                      {(provided, { isDragging }) => (
                        <div
                          ref={provided.innerRef}
                          className="flex dib ma2"
                          {...provided.dragHandleProps}
                          style={{
                            background: (isDragging ? "#a7101b" : null),
                            ...provided.draggableProps.style
                          }}
                        >
                          <Card key={item.cardId} value={item.img} />
                        </div>
                      )}
                    </Draggable>
                  ))
                }
              </div>
            )}
          </Droppable>
        </div>
        <HKModal
          show={showModal}
          header={isRoundComplete ? <div style={{fontSize:"24px", margin:"10px", textAlign:"center"}}>Congratulations! </div> : <div style={{fontSize:"20px", margin:"10px", textAlign:"center"}}> You are not done just yet! </div>}
          onDismiss={() => {
            if (isRoundComplete) {
              props.setIsLoggedIn(false)
              props.dispatch({ type: playersConstants.CLEAR_GAME })
            } else {
              props.dispatch({ type: playersConstants.CONTINUE_GAME })
            }
          }}
          buttons={[
          { text, value: "understand", type: "primary" }
          ]}
          >
            <div>
              {isRoundComplete ? <div className="helvetica" style={{fontSize:"16px", margin:"10px", textAlign:"center"}}>You successfully completed the experiment! All cards have been sorted accordingly. </div> : <div style={{fontSize:"16px", margin:"10px", textAlign:"center"}}>
              It looks like the cards have not been fully sorted yet! Head back to the game to try complete it!
              </div> }
            </div>
        </HKModal>
      </React.Fragment>
    )
  } else {
    return [loading, loader]
  }
}

export default compose(
  withState("showModal", "toggleModal", false),
  lifecycle({
    componentDidMount() {
      console.log(this.props)
    }
  })
)(MainPage)

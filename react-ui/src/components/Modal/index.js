// @flow
import React from "react"
import { HKModal, HKDropdown } from "@heroku/react-hk-components"
import { compose, withState } from "recompose"

type Props = {
  showModal: boolean,
  toggleModal: boolean => void,
  playerValue: string,
  updatePlayer: string => void,
  cardValue: string,
  updateCard: string => void
};

const TradeRequest = ({
  showModal,
  playerValue,
  updatePlayer,
  cardValue,
  updateCard,
  toggleModal
}: Props) => {
  return (
    <HKModal
      show={showModal}
      header={<div>Trade Request </div>}
      onDismiss={() => toggleModal(false)}
      buttons={[
        { text: "cancel", value: "cancel", type: "tertiary" },
        { text: "trade", value: "trade", type: "primary" }
      ]}
    >
      <div>
        <div>
          <div>Select the player you would like to give a card to</div>
          <HKDropdown title={playerValue}>
            <li
              className="hk-dropdown-item"
              onClick={() => updatePlayer("Ayat")}
            >
              Ayat
            </li>
            <li
              className="hk-dropdown-item"
              onClick={() => updatePlayer("Victoria")}
            >
              Victoria
            </li>
          </HKDropdown>
        </div>
        <div>
          <div>Select the card you would like to trade</div>
          <HKDropdown title={cardValue}>
            <li className="hk-dropdown-item" onClick={() => updateCard("1")}>
              1
            </li>
            <li className="hk-dropdown-item" onClick={() => updateCard("2")}>
              2
            </li>
          </HKDropdown>
        </div>
      </div>
    </HKModal>
  )
}

export const TradeModal = compose(
  withState("playerValue", "updatePlayer", "Select a Player"),
  withState("cardValue", "updateCard", "Select a Card")
)(TradeRequest)

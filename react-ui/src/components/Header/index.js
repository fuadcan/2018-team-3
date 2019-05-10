// @flow
import React from "react"
import "./styles.css"

type Props = {
  gameStart: boolean,
  isPendingTransaction: boolean,
  textToDisplay: string,
  handleGameDone: any,
};

const Header = ({
  gameStart = false,
  isPendingTransaction = false,
  textToDisplay = "",
  handleGameDone
}: Props) => {
  return (
    <div className="header w-100 relative">
      <div className="headerName absolute relative white b tc f1">{textToDisplay}</div>
      {gameStart && <button type="button" disabled={isPendingTransaction} onClick={handleGameDone} className="shadow-4 DoneButton"><div>{"We're Done"}</div></button>}
    </div>
  )
}

export default Header

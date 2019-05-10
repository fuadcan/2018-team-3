// @flow
import React from "react"

type Props = {
  value: string,
}

const Card = ({ value }: Props) => {
  return (
    <div className="z-1 relative shadow-4 bg-white card">
      <img src={value} style={{ maxWidth: "250px" }} />
    </div>
  )
}

export default Card

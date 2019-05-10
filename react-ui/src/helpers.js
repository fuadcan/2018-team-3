export const getFromPlayerFromId = (state, playerId) => {
  if (!state) {
    return
  }
  const playerType = ["second", "third", "fourth"]
  const playerIds = playerType.map(player => state[`${player}Player`].id)
  const index = playerIds.indexOf(playerId)
  return playerType[index]
}

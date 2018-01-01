export const actions = {
  LOADING_KEYWORD: 'LOADING_KEYWORD',
  ADD_KEYWORD: 'ADD_KEYWORD',
  MOVE_KEYWORD: 'MOVE_KEYWORD',
}

export const addKeyword = (statusSeekerInstance) => {
  return dispatch => {
    dispatch({
      type: actions.LOADING_KEYWORD,
    })
    // Generate random number between 0 and 11. Once we have implemented QR code support
    // this id will be generated when the users scans the QR and the corresponding word
    // will be returned without giving away it's position in the array.
    const id = Math.floor((Math.random() * 12));

    statusSeekerInstance.getWord(id).then(keyword =>
      // Update state with the result.
      dispatch ({
        type: actions.ADD_KEYWORD,
        keyword
      })
    )
  }
}

export const moveKeywordInList = (dragIndex, hoverIndex) => ({
  type: actions.MOVE_KEYWORD,
  dragIndex,
  hoverIndex,
})

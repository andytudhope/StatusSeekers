import {
  actions
} from '../actions'
import {
  initialState
} from './initialState'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOADING_KEYWORD:
      return {
        ...state,
        currentKeyword: {
          ...initialState.currentKeyword,
          isFetching: true,
        }
      }
    case actions.ADD_KEYWORD:
      let isNew = state.wordList.indexOf(action.keyword) == -1
      let newWordList = isNew ?
       [...state.wordList, action.keyword]
       : state.wordList

      return {
        ...state,
        currentKeyword: {
          ...initialState.currentKeyword,
          isNew,
          word: action.keyword,
        },
        wordList: newWordList
      }
    case actions.MOVE_KEYWORD:
      const dragKeyword = state.wordList[action.dragIndex]
      let keywords = [...state.wordList]
      keywords.splice(action.dragIndex, 1)
      keywords.splice(action.hoverIndex, 0, dragKeyword)

      return {
        ...state,
        wordList: keywords
      }
    default:
      return state
  }
}

export default reducer

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
    default:
      return state
  }
}

export default reducer

export const userType = {
  UNKNOWN: 'UNKNOWN',
  WITHDRAW_ETH: 'WITHDRAW_ETH',
  REQUEST_WITHDRAW: 'REQUEST_WITHDRAW',
}

export const initialState = {
  currentKeyword: {
    word: '',
    isNew: false, // to allow display of message if you get a word you already have.
    isFetching: false, // to allow some nicer UI while waiting for keyword to load.
  },
  wordList: []
}

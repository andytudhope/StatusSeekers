import StatusSeekerContract from '../../build/contracts/StatusSeeker.json'

export const actions = {
  LOADING_KEYWORD: 'LOADING_KEYWORD',
  ADD_KEYWORD: 'ADD_KEYWORD',
}

export const addKeyword = (web3) => {
  return dispatch => {
    dispatch({
      type: actions.LOADING_KEYWORD,
    })

    const contract = require('truffle-contract')
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(web3.currentProvider)

    web3.eth.getAccounts(async (error, accounts) => {
      console.log(accounts)

      const statusSeekerInstance = await statusSeeker.at("0x9cfd83d56a7937cf7c5afe2281e4738472c4ab61")

      // Generate random number between 0 and 11. Once we have implemented QR code support
      // this id will be generated when the users scans the QR and the corresponding word
      // will be returned without giving away it's position in the array.
      const id = Math.floor((Math.random() * 11));

      const keyword = await statusSeekerInstance.keyWord.call(id, {from: accounts[0]})

      // Update state with the result.
      dispatch ({
        type: actions.ADD_KEYWORD,
        keyword
      })
    })
  }
}

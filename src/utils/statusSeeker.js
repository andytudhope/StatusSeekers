import StatusSeekerContract from '../../build/contracts/StatusSeeker.json'
import contract from 'truffle-contract'

export default {
  withProvider: (provider) => {
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(provider)

    // @TODO - make this more easily configurable
    const statusSeekerInstance = statusSeeker.at("0x9cfd83d56a7937cf7c5afe2281e4738472c4ab61")

    return {
      getWord: async (id) => statusSeekerInstance.keyWord.call(id)
    }
  }
}

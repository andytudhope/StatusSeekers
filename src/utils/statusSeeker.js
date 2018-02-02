import StatusSeekerContract from '../../build/contracts/StatusSeeker.json'
import contract from 'truffle-contract'


export default {
  withProvider: (provider) => {
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(provider)

    // @TODO - make this more easily configurable
    const statusSeekerInstance = statusSeeker.at("0x3be1b82909afc4581c3ac8a7b3005cfdfa19bb4e")

    return {
      getWord: async (id) => statusSeekerInstance.keyWords.call(id)
    }
  }
}

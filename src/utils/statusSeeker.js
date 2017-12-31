import StatusSeekerContract from '../../build/contracts/StatusSeeker.json'
import contract from 'truffle-contract'

export default {
  withProvider: (provider) => {
    const statusSeeker = contract(StatusSeekerContract)
    statusSeeker.setProvider(provider)

    // @TODO - make this more easily configurable
    const statusSeekerInstance = statusSeeker.at("0x345ca3e014aaf5dca488057592ee47305d9b3e10")

    return {
      getWord: async (id) => statusSeekerInstance.keyWord.call(id)
    }
}
}
var StatusSeeker = artifacts.require("./StatusSeeker")
const toBytes32 = require('../SeekerBackend/utils/toBytes32')

let keyWords = ['cat', 'rabbit', 'hole', 'art', 'project', 'space', 'time', 'love', 'peace', 'kind', 'human', 'being']
for (var i = 0; i < 12; i++) {
  keyWords[i] = toBytes32(parseInt(web3.toHex(keyWords[i]), 16))
}

console.log(keyWords)

module.exports = function(deployer) {
  deployer.deploy(StatusSeeker)
    .then(() => {
      return StatusSeeker.deployed()
        .then(kw => {
          kw.setKeyWords(keyWords).then((res) => {
            console.log('Set keyWords!', res.tx)
          })
        })
    })
}

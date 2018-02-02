const StatusSeekers = artifacts.require('StatusSeeker')
const toBytes32 = require('../SeekerBackend/utils/toBytes32')
const assertRevert = require('./helpers/assertRevert')
var sha3 = require('solidity-sha3').default
const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('StatusSeekers', accounts => {
    let keyWords
    const seeker = accounts[0]
    const word = 'test'

    // Need to convert the strong to hex and then cast this to an int in order for bytes32 casting to work properly
    const wordNum = parseInt(web3.toHex(word), 16)
    const wordBytes = toBytes32(wordNum)

    const nonce = Math.floor(Math.random()*100)

    beforeEach(async () => {
        statusSeekersInstance = await StatusSeekers.new(['abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued', 'abued'], { from: seeker })
      })

    describe('check off chain word hashing', () => {
        let hash
        let solHashResult
        beforeEach(async () => {
          hash = sha3(wordNum, nonce)
          solHashResult = await statusSeekersInstance.hasher(wordBytes, nonce, {from: seeker})
        })

        it('should hash the user address and tokenId the same in javascript as in solidity', async () => {
            hash.should.be.equal(solHashResult)
        })
    })

    describe('verify()', async () => {
        let keyWords = []
        let nonces = []
        let hashes = []
        beforeEach(async () => {
            for (var i = 0; i < 12; i++) {
                keyWords[i] = toBytes32(parseInt(web3.toHex(Math.random().toString(36).substr(8))), 16)
                nonces[i] = Math.floor(Math.random()*100)
                hashes[i] = sha3(keyWords[i], nonces[i])
            }
            await statusSeekersInstance.addRewardKeyWords(hashes, {from: seeker})
        })

        it('should check that rewardKeyWords exist and are the same', async () => {
            let rewardKeyWords = []
            for (var i = 0; i < 12; i++) {
                rewardKeyWords[i] = await statusSeekersInstance.hashedKeyWords(i)
            }
            assert.deepEqual(rewardKeyWords, hashes, 'The hashes are not equal')
        })

        it('should return true if hashes are in correct order', async () => {
            let success = await statusSeekersInstance.verify(keyWords, nonces, {from: seeker})
            assert.isTrue(success, 'verify() returned false')
        })

        it('should throw an exception if hashes are in incorrect order', async () => {
            Array.prototype.move = function (from, to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
            keyWords.move(3,0)
            await assertRevert(statusSeekersInstance.verify(keyWords, nonces, {from: seeker}))
        })

        it('should throw an exception if one of the hashes is incorrect', async () => {
            keyWords.splice(0, 1, toBytes32(parseInt(web3.toHex(Math.random().toString(36).substr(8))), 16))
            await assertRevert(statusSeekersInstance.verify(keyWords, nonces, {from: seeker}))
        })

        it('should throw an exception if nonces are in incorrect order', async () => {
            Array.prototype.move = function (from, to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            }
            nonces.move(0,3)
            await assertRevert(statusSeekersInstance.verify(keyWords, nonces, {from: seeker}))
        })

        it('should throw an exception if one of the nonces is incorrect', async () => {
            nonces.splice(0, 1, Math.floor(Math.random()*100))
            await assertRevert(statusSeekersInstance.verify(keyWords, nonces, {from: seeker}))
        })
    })
})

const assertRevert = require('./helpers/assertRevert')
const BigNumber = web3.BigNumber
const { generateRandomInLevel, getEdgeCaseLevels } = require('./helpers/generateRandomInLevel')
const { computeMintedSignature, computeLevelSignature } = require('../SeekerBackend/utils/tokenIssue.js')
const NonFungibleToken = artifacts.require('NonFungibleCollectable.sol')
const Promise = require('bluebird');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('NonFungibleToken', accounts => {
  let token = null
  const _name = 'Non Fungible Collectable'
  const _symbol = 'VAT' // Valuable Art Token
  const firstTokenId = 1
  const secondTokenId = 2
  const level0Token = 8
  const level5Token = '5192296858534827628530496329220099'
  const level7Token = '356811923176489970264571492362373784095686659'
  const nonFungibleCollectableOwner = accounts[0] // only owner can create new tokens
  const issuingWallet = accounts[1] // only issuing wallet can issue tokens via off chain signature
  const recipientAddress = accounts[2] // only issuing wallet can issue tokens via off chain signature
  const attackerAddress = accounts[3]
  const otherUser = accounts[4]

  if (typeof web3.eth.getAccountsPromise === 'undefined') {
    Promise.promisifyAll(web3.eth, { suffix: 'Promise' });
  }

  beforeEach(async () => {
    token = await NonFungibleToken.new(_name, _symbol, issuingWallet, { from: nonFungibleCollectableOwner })
    await token.ownerMint(issuingWallet, firstTokenId, { from: nonFungibleCollectableOwner })
    await token.ownerMint(issuingWallet, secondTokenId, { from: nonFungibleCollectableOwner })
  })

  describe('setup', () => {
    it('should deploy and test tokens correctly issued', async () => {
      const name = await token.name()
      name.should.be.equal(_name)
      const symbol = await token.symbol()
      symbol.should.be.equal(_symbol)
      const totalSupply = await token.totalSupply()
      totalSupply.should.be.bignumber.equal(2)
      const balance1 = await token.balanceOf(issuingWallet)
      balance1.should.be.bignumber.equal(2)
      const balance2 = await token.balanceOf(attackerAddress)
      balance2.should.be.bignumber.equal(0)
    })
  })

  describe('claimMintedCollectableWithCoupon()', () => {
    let signatureObject
    let solHashResult
    beforeEach(async () => {
      signatureObject = await computeMintedSignature(firstTokenId, recipientAddress, issuingWallet, web3)
      solHashResult = await token.hasher(firstTokenId, {from: recipientAddress})
    })

    it('should hash the user address and tokenId the same in javascript as in solidity', async () => {
      signatureObject.prefixedHash.should.be.equal(solHashResult)
    })

    describe('the getAddress function', () => {
      it('should get the correct address', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        const address = await token.getAddress(prefixedHash, v, r, s)
        address.should.be.equal(issuingWallet)
      })
    })

    it('should allow the user to claim a token from the `collectableCouponIssuer` if signature is correct', async () => {
      const {prefixedHash, v, r, s} = signatureObject
      const issueTx = await token.claimMintedCollectableWithCoupon(firstTokenId, prefixedHash, v, r, s, {from: recipientAddress})
      const newOwner = await token.ownerOf(firstTokenId)
      newOwner.should.be.equal(recipientAddress)
    })

    describe('when the user tries to use someone elses coupon/signature', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        await assertRevert(token.claimMintedCollectableWithCoupon(firstTokenId, prefixedHash, v, r, s, {from: attackerAddress}))
        const newOwner = await token.ownerOf(firstTokenId)
        newOwner.should.be.equal(issuingWallet)
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })

    describe('when the user tries to claim a token that was not assigned to them via a valid coupon', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        await assertRevert(token.claimMintedCollectableWithCoupon(secondTokenId, prefixedHash, v, r, s, {from: recipientAddress}))
        const newOwner = await token.ownerOf(secondTokenId)
        newOwner.should.be.equal(issuingWallet)
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })

    describe('when a user uses a signature issued by an attacker (other than the `collectableCouponIssuer`)', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = await computeMintedSignature(firstTokenId, recipientAddress, attackerAddress, web3)
        await assertRevert(token.claimMintedCollectableWithCoupon(firstTokenId, prefixedHash, v, r, s, {from: recipientAddress}))
        const newOwner = await token.ownerOf(firstTokenId)
        newOwner.should.be.equal(issuingWallet)
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })

    describe('when the attacker tries to claim a token not owned by `collectableCouponIssuer`', () => {
      it('reverts', async () => {
        await token.transfer(otherUser, firstTokenId, { from: issuingWallet });
        const newOwner = await token.ownerOf(firstTokenId)
        newOwner.should.be.equal(otherUser)

        const {prefixedHash, v, r, s} = signatureObject
        await assertRevert(token.claimMintedCollectableWithCoupon(firstTokenId, prefixedHash, v, r, s, {from: recipientAddress}))
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })
  })

  describe('claimLevelCollectableWithCoupon()', () => {
    let signatureObject
    let solHashResult
    beforeEach(async () => {
      signatureObject = await computeLevelSignature(level0Token, 0, recipientAddress, issuingWallet, web3)
      solHashResult = await token.hasherWithLevel(level0Token, 0, {from: recipientAddress})
    })

    it('should hash the user address and tokenId the same in javascript as in solidity', () => {
      signatureObject.prefixedHash.should.be.equal(solHashResult)
    })

    describe('the user has never claimed a token', () => {
      it('should allow the user to claim a level token if signature is correct', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        const issueTx = await token.claimLevelCollectableWithCoupon(level0Token, 0, prefixedHash, v, r, s, {from: recipientAddress})
        const newOwner = await token.ownerOf(level0Token)
        newOwner.should.be.equal(recipientAddress)
      })
    })

    describe('the user has claimed a token', () => {
      beforeEach(async () => {
        // create a level 5 token for recipientAddress:
        const {prefixedHash, v, r, s} = await computeLevelSignature(level5Token, 5, recipientAddress, issuingWallet, web3)
        const issueTx = await token.claimLevelCollectableWithCoupon(level5Token, 5, prefixedHash, v, r, s, {from: recipientAddress})
        const newOwner = await token.ownerOf(level5Token)
        newOwner.should.be.equal(recipientAddress)
      })

      it('should allow the user to replace a level token if it is a higher level than the current token', async () => {
        const {prefixedHash, v, r, s} = await computeLevelSignature(level7Token, 7, recipientAddress, issuingWallet, web3)
        solHashResult = await token.hasherWithLevel(level7Token, 7, {from: recipientAddress})
        const issueTx = await token.claimLevelCollectableWithCoupon(level7Token, 7, prefixedHash, v, r, s, {from: recipientAddress})
        const newOwner = await token.ownerOf(level7Token)
        newOwner.should.be.equal(recipientAddress)
        // make sure `level5Token` has been erased from existence.
        await assertRevert(token.ownerOf(level5Token))
        const oldTokenIndex = await token.ownedTokensIndex(level5Token)
        oldTokenIndex.should.be.bignumber.equal(0)
      })

      it('should not allow the user to claim a level token if it is a lower level than the current token', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        const issueTx = await token.claimLevelCollectableWithCoupon(level0Token, 0, prefixedHash, v, r, s, {from: recipientAddress})
        await assertRevert(token.ownerOf(level0Token))
      })
    })

    describe('when the user tries to use someone elses coupon/signature', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        await assertRevert(token.claimLevelCollectableWithCoupon(level0Token, 0, prefixedHash, v, r, s, {from: attackerAddress}))
        await assertRevert(token.ownerOf(level0Token)) // ie it shouldn't have an owner
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })

    describe('when the user tries to claim a level token that was not assigned to them via a valid coupon', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = signatureObject
        await assertRevert(token.claimLevelCollectableWithCoupon(level5Token, 5, prefixedHash, v, r, s, {from: recipientAddress}))
        await assertRevert(token.ownerOf(secondTokenId))
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })

    describe('when a user uses a signature issued by an attacker (other than the `collectableCouponIssuer`)', () => {
      it('reverts', async () => {
        const {prefixedHash, v, r, s} = await computeLevelSignature(level0Token, 0, recipientAddress, attackerAddress, web3)
        await assertRevert(token.claimLevelCollectableWithCoupon(level0Token, 0, prefixedHash, v, r, s, {from: recipientAddress}))
        const newOwner = await token.ownerOf(firstTokenId)
        newOwner.should.be.equal(issuingWallet)
        const balance2 = await token.balanceOf(attackerAddress)
        balance2.should.be.bignumber.equal(0)
      })
    })
  })

  describe('getTokenLevel()', () => {
    const testLevelEdgeCases = level =>
      it('should correctly determine the level for edge cases between ' + level + ' and ' + (level + 1) + ' level tokens.', async () => {
        const {above, below} = getEdgeCaseLevels(level)
        const returnedBelow = await token.getTokenLevel.call(below)
        returnedBelow.should.be.bignumber.equal(level)
        const returnedAbove = await token.getTokenLevel.call(above)
        returnedAbove.should.be.bignumber.equal(level + 1)
      })

    const testLevel = (level, iterations) =>
      it('should correctly get the level of a level of ' + iterations + ' random ' + level + ' tokens', () => {
        [...Array(iterations).keys()].map(async i => {
          process.stdout.write('testing iteration' + i + ' level ' + level + '\r')
          const tokenId = generateRandomInLevel(level)
          BigNumber.config({ROUNDING_MODE: BigNumber.ROUND_FLOOR})
          const tokenIdString = tokenId.toString()
          const returnedLevel = await token.getTokenLevel.call(tokenIdString)
          returnedLevel.should.be.bignumber.equal(level)
        })
      })

    const range12 = [...Array(12).keys()] // this is just a list from 0-11
    const range13 = [...range12, 12] // this is just a list from 0-12
    range12.map(i => testLevelEdgeCases(i))
    range13.map(i => testLevel(i, 100))
  })
})

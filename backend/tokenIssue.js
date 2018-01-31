const computeSignature = (tokenId, recipientAddress, issuingAddress, web3) => {
  const idString = (tokenId).toString(16)
  const hashInput = '0'.repeat(64 - idString.length) + idString + web3.toHex(recipientAddress).slice(2)
  const hash = web3.sha3(hashInput, { encoding: 'hex' })

  // break the signature into its components. For example see: https://ethereum.stackexchange.com/q/15364/4642
  const signature = web3.eth.sign(issuingAddress, hash);
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v =  web3.toDecimal('0x' + signature.slice(130, 132)) + 27

  // this prefix is required by the `ecrecover` builtin solidity function (other than that it is pretty arbitrary)
  const prefix = "\x19Ethereum Signed Message:\n32";
  const prefixedBytes = web3.fromAscii(prefix) + hash.slice(2)
  const prefixedHash = web3.sha3(prefixedBytes, { encoding: 'hex' })

  return {
    hash,
    prefixedHash,
    signature,
    r,
    s,
    v,
  }
}

module.exports = {
  computeSignature
}

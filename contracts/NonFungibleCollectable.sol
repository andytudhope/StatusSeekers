pragma solidity ^0.4.18;

import './lib/NonFungibleToken.sol';
import './lib/Ownable.sol';

contract NonFungibleCollectable is NonFungibleToken, Ownable {
  address public collectableCouponIssuer;
  // this constant is used by the signer
  bytes signaturePrefix = "\x19Ethereum Signed Message:\n32";

  function NonFungibleCollectable(string name, string symbol, address couponIssuer)
    public
    NonFungibleToken(name, symbol)
  {
    collectableCouponIssuer = couponIssuer;
  }


  function ownerMint(address _to, uint256 _tokenId)
    public
    onlyOwner
  {
    super.mint(_to, _tokenId);
  }

  function hasher(uint tokenId) public view returns(bytes32) {
    return keccak256(signaturePrefix, keccak256(tokenId, msg.sender));
  }

  // ecrecover is a builtin solidity command that generates the address of a signature given the 4 parameters of the signature
  // see here: https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#mathematical-and-cryptographic-functions
  function getAddress(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns(address) {
    return ecrecover(hash, v, r, s);
  }

  function claimCollectableWithCoupon(uint tokenId, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public {
    bytes32 computedHash = hasher(tokenId);
    require(ownerOf(tokenId) == collectableCouponIssuer);
    require(computedHash == hash);
    require(getAddress(hash, v, r, s) == collectableCouponIssuer);

    clearApprovalAndTransfer(collectableCouponIssuer, msg.sender, tokenId);
  }
}

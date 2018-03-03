pragma solidity ^0.4.18;

import './lib/NonFungibleToken.sol';
import './lib/Ownable.sol';

contract NonFungibleCollectable is NonFungibleToken, Ownable {
  address public collectableCouponIssuer;
  mapping (address => LevelRecord) private levelToken;
  // this constant is used by the signer
  bytes constant signaturePrefix = "\x19Ethereum Signed Message:\n32";

  struct LevelRecord {
    bool hasClaimedToken;
    uint8 tokenIndex;
  }
  /*
  Level 0 is between 2^0=0 and 2^40=1099511627776
  Level 1 is between 2^40=1099511627776 and 2^58=288230376151711744
  Level 2 is between 2^58=288230376151711744 and 2^76=75557863725914323419136
  Level 3 is between 2^76=75557863725914323419136 and 2^94=19807040628566084398385987584
  Level 4 is between 2^94=19807040628566084398385987584 and 2^112=5192296858534827628530496329220096
  Level 5 is between 2^112=5192296858534827628530496329220096 and 2^130=1361129467683753853853498429727072845824
  Level 6 is between 2^130=1361129467683753853853498429727072845824 and 2^148=356811923176489970264571492362373784095686656
  Level 7 is between 2^148=356811923176489970264571492362373784095686656 and 2^166=93536104789177786765035829293842113257979682750464
  Level 8 is between 2^166=93536104789177786765035829293842113257979682750464 and 2^184=24519928653854221733733552434404946937899825954937634816
  Level 9 is between 2^184=24519928653854221733733552434404946937899825954937634816 and 2^202=6427752177035961102167848369364650410088811975131171341205504
  Level 10 is between 2^202=6427752177035961102167848369364650410088811975131171341205504 and 2^220=1684996666696914987166688442938726917102321526408785780068975640576
  Level 11 is between 2^220=1684996666696914987166688442938726917102321526408785780068975640576 and 2^238=441711766194596082395824375185729628956870974218904739530401550323154944
  Level 12 is between 2^238=441711766194596082395824375185729628956870974218904739530401550323154944 and 2^256=115792089237316195423570985008687907853269984665640564039457584007913129639936
  */
  uint256 constant level0 = 1099511627776;
  uint256 constant level1 = 288230376151711744;
  uint256 constant level2 = 75557863725914323419136;
  uint256 constant level3 = 19807040628566084398385987584;
  uint256 constant level4 = 5192296858534827628530496329220096;
  uint256 constant level5 = 1361129467683753853853498429727072845824;
  uint256 constant level6 = 356811923176489970264571492362373784095686656;
  uint256 constant level7 = 93536104789177786765035829293842113257979682750464;
  uint256 constant level8 = 24519928653854221733733552434404946937899825954937634816;
  uint256 constant level9 = 6427752177035961102167848369364650410088811975131171341205504;
  uint256 constant level10 = 1684996666696914987166688442938726917102321526408785780068975640576;
  uint256 constant level11 = 441711766194596082395824375185729628956870974218904739530401550323154944;

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

  function hasher(uint256 tokenId) public view returns(bytes32) {
    return keccak256(signaturePrefix, keccak256(tokenId, msg.sender));
  }

  function hasherWithLevel(uint256 tokenId, uint8 tokenLevel) public view returns(bytes32) {
    return keccak256(signaturePrefix, keccak256(tokenId, tokenLevel, msg.sender));
  }

  // ecrecover is a builtin solidity command that generates the address of a signature given the 4 parameters of the signature
  // see here: https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#mathematical-and-cryptographic-functions
  function getAddress(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns(address) {
    return ecrecover(hash, v, r, s);
  }

  function claimMintedCollectableWithCoupon(uint256 tokenId, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public {
    bytes32 computedHash = hasher(tokenId);
    require(ownerOf(tokenId) == collectableCouponIssuer);
    require(computedHash == hash);
    require(getAddress(hash, v, r, s) == collectableCouponIssuer);

    clearApprovalAndTransfer(collectableCouponIssuer, msg.sender, tokenId);
  }

  function claimLevelCollectableWithCoupon(uint256 tokenId, uint8 tokenLevel, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    public returns(bool success)
  {
    bytes32 computedHash = hasherWithLevel(tokenId, tokenLevel);
    require(tokenOwner[tokenId] == address(0));
    require(computedHash == hash);
    require(getAddress(hash, v, r, s) == collectableCouponIssuer);

    if (levelToken[msg.sender].hasClaimedToken) {
      uint256 prevTokenIndex = levelToken[msg.sender].tokenIndex;
      uint256 prevTokenId = ownedTokens[msg.sender][prevTokenIndex];
      uint8 prevTokenLevel = getTokenLevel(prevTokenId);
      if (prevTokenLevel < tokenLevel) {
        ownedTokens[msg.sender][prevTokenIndex] = tokenId;
        tokenOwner[tokenId] = msg.sender;
        ownedTokensIndex[tokenId] = prevTokenIndex;
        delete tokenOwner[prevTokenId];
        delete ownedTokensIndex[prevTokenId];
        return true;
      } else {
        return false;
      }
    } else {
      super.mint(msg.sender, tokenId);
      levelToken[msg.sender].hasClaimedToken = true;
      levelToken[msg.sender].tokenIndex = uint8(ownedTokensIndex[tokenId]);
      return true;
    }
  }

  function getTokenLevel(uint tokenId) public view returns(uint8 level){
    if (tokenId < level6) {
      if (tokenId < level3) {
        if (tokenId < level1) {
          if (tokenId < level0) {
            return 0;
          } else {
            return 1;
          }
        } else {
          if (tokenId < level2) {
            return 2;
          } else {
            return 3;
          }
        }
      } else {
        if (tokenId < level4) {
          return 4;
        } else {
          if(tokenId < level5) {
            return 5;
          } else {
            return 6;
          }
        }
      }
    } else {
      if (tokenId < level9) {
        if (tokenId < level7) {
          return 7;
        } else {
          if(tokenId < level8) {
            return 8;
          } else {
            return 9;
          }
        }
      } else {
        if (tokenId < level10) {
          return 10;
        } else {
          if(tokenId < level11) {
            return 11;
          } else {
            return 12;
          }
        }
      }
    }
  }
}

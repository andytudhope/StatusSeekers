pragma solidity ^0.4.18;

import "./lib/Ownable.sol";

contract StatusSeeker is Ownable {
    
    bytes32[12] public keyWords;
    bytes32[12] public hashedKeyWords;

    event ContractFunded(address _from, uint _amount);

    function setKeyWords(bytes32[12] _keyWords) onlyOwner public {
        keyWords = _keyWords;
    }

    function hasher(bytes32 _keyWord, uint256 _nonce) public pure returns (bytes32) {
        return keccak256(_keyWord, _nonce);
    } 

    function addRewardKeyWords(bytes32[12] _hashedKeyWords) onlyOwner public {
        hashedKeyWords = _hashedKeyWords;
    }

    function verify(bytes32[12] _attemptKeyWords, uint256[12] _nonce) public returns (bool) {
        for (uint8 i = 0; i < 12; i++) {
            require(hashedKeyWords[i] == hasher(_attemptKeyWords[i], _nonce[i]));
        }
        _transferWinnings(msg.sender);
    }

    function _transferWinnings(address _to) internal {
        uint256 amount = this.balance;
        _to.transfer(amount);
    }

    function() payable {
        ContractFunded(msg.sender, msg.value);
    }
    
}

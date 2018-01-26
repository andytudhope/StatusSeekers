pragma solidity ^0.4.18;

/**
 * @title ERC721 interface
 * @dev see https://github.com/ethereum/eips/issues/721
 */
contract ERC721 {
  event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

  function name() public view returns (string _name);
  function symbol() public view returns (string _symbol);
  function totalSupply() public view returns (uint256 _totalSupply);

  function balanceOf(address _owner) public view returns (uint256 _balance);
  function ownerOf(uint256 _tokenId) public view returns (address _owner);
  function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256 _tokenId);
  function transfer(address _to, uint256 _tokenId) public;
  function approve(address _to, uint256 _tokenId) public;
  function takeOwnership(uint256 _tokenId) public;
}

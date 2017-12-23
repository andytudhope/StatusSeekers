var StatusSeeker = artifacts.require("./StatusSeeker.sol");

module.exports = function(deployer) {
  deployer.deploy(StatusSeeker);
};

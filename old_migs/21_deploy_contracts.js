var UserRepositoryImpl = artifacts.require("./UserRepositoryImpl.sol");

module.exports = function(deployer) {
  deployer.deploy(UserRepositoryImpl, {gas:4555000});
};

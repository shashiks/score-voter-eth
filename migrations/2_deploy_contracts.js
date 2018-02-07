var UserRepositoryImpl = artifacts.require("./UserRepositoryImpl.sol");
var ScoreVoter = artifacts.require("./ScoreVoter.sol");

module.exports = function(deployer) {
  deployer.deploy(UserRepositoryImpl);
};

module.exports = function(deployer) {
  deployer.deploy(ScoreVoter);
};


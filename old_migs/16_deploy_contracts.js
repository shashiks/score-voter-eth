var ScoreVoter = artifacts.require("./ScoreVoter.sol");

module.exports = function(deployer) {
  deployer.deploy(ScoreVoter);
};


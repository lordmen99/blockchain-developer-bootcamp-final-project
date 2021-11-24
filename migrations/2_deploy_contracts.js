const Gringotts = artifacts.require("Gringotts");
const Reward = artifacts.require("Reward");

module.exports = function(deployer) {
  deployer.deploy(Gringotts);
  deployer.deploy(Reward);
}
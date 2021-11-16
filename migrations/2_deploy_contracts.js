const Savings = artifacts.require("Savings");

module.exports = function(deployer) {
  deployer.deploy(Savings);
}
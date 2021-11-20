const Gringotts = artifacts.require("Gringotts");

module.exports = function(deployer) {
  deployer.deploy(Gringotts);
}
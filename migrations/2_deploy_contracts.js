const Gringotts = artifacts.require("Gringotts");
const Galleon = artifacts.require("Galleon");

module.exports = async function(deployer) {
  await deployer.deploy(Galleon);
  const galleon = await Galleon.deployed();
  console.log(`Galleon token contract deployed at ${galleon.address}`);

  await deployer.deploy(Gringotts, galleon.address);
  const gringotts = await Gringotts.deployed();
  console.log(`Gringotts bank contract deployed at ${gringotts.address}`);
}
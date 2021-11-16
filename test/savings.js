const Savings = artifacts.require("Savings");

contract("Savings", accounts => {
  it("should assert true", async function () {
    await Savings.deployed();
    return assert.isTrue(true);
  });

  //TODO testAddUser

  //TODO testGetBalance

  //TODO testDeposit

  //TODO testWithdraw

});

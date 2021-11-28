let BN = web3.utils.BN;
const Gringotts = artifacts.require("Gringotts");
const Galleon = artifacts.require("Galleon");

contract("Gringotts", accounts => {
  const [_owner, albus, bathilda] = accounts;
  let instance;
  let tokenInstance; 

  beforeEach(async () => {
    tokenInstance = await Galleon.new();
    instance = await Gringotts.new(tokenInstance.address);
  });

  it("should get a user's balance", async () => {
    
    const balanceA = await instance.getBalance( { from: albus } );

    assert.equal(Number(balanceA), 0, "incorrect initial balance");
  });

  it("should let a user deposit funds and update their balance", async () => {
    const amount = 1E18;
    const balanceBefore = await instance.getBalance( { from: bathilda } );  
    await instance.deposit( { from: bathilda, value: amount} );
    const balanceAfter = await instance.getBalance( { from: bathilda } );  

    assert.equal(Number(balanceAfter), Number(balanceBefore) + amount, "incorrect balance after deposit");
  });

  it("should emit a LogDeposit event after a deposit is made", async () => {
    const amount = 1E18;
    const deposit = await instance.deposit( { from: bathilda, value: amount} );
    
    let eventEmitted = false;

    if (deposit.logs[0].event == "LogDeposit") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "should log a new deposit",
    );
  });

  it("should let a user withdraw funds and update their balance", async () => {
    const depositAmount = web3.utils.toWei('2','ether');
    const withdrawAmount = web3.utils.toWei('1','ether');

    const balanceA1 = await instance.getBalance( { from: albus } );
    
    await instance.deposit( { from: albus, value: depositAmount } );
    
    const balanceA2 = await instance.getBalance( { from: albus } );

    await instance.withdraw( withdrawAmount, { from: albus });
    
    const balanceA3 = await instance.getBalance( { from: albus } );

    assert.equal(Number(balanceA1), 0, "incorrect initial balance");
    assert.equal(Number(balanceA2), Number(balanceA1) + depositAmount, "incorrect balance after deposit");
    assert.equal(Number(balanceA3), Number(balanceA2) - withdrawAmount, "incorrect balance after withdrawal")
  });

  it("should emit a LogWithdrawal event after a withdrawal is made", async () => {
    const amount = web3.utils.toWei('1','ether');

    await instance.deposit( { from: bathilda, value: amount} );
    const withdrawal = await instance.withdraw(amount, { from: bathilda})
    let eventEmitted = false;

    if (withdrawal.logs[0].event == "LogWithdrawal") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "should log a new deposit",
    );
  });

  it("should allow the owner to approve the bank contract to spend galleons", async () => {
    const galleonBalanceBefore = await tokenInstance.balanceOf(instance.address).then(function(result) {
      result = Number(result);
      return result;
    });

    await tokenInstance.increaseAllowance(instance.address, 1000);
    await instance.transferGalleonsToContract(1000);
    
    const galleonBalanceAfter = await tokenInstance.balanceOf(instance.address).then(function(result) {
      result = Number(result);
      return result;
    });

    assert.equal(galleonBalanceBefore, 0, "Incorrect initial balance");
    assert.equal(galleonBalanceAfter, 1000, "Incorrect updated balance");
  });
  
  it("should mint galleons to a user from the bank contract if the user has made a deposit", async () => {
    const depositAmount = web3.utils.toWei('2','ether');
    await instance.deposit({ from: albus, value: depositAmount } );

    await tokenInstance.increaseAllowance(instance.address, 1000000000);
    await instance.transferGalleonsToContract(1000000000, { from: _owner });

    const galleonBalanceBefore = await tokenInstance.balanceOf(albus).then(function(result) {
      result = Number(result);
      return result;
    });
    
    await instance.mintGalleonsToUser(albus);

    const galleonBalanceAfter = await tokenInstance.balanceOf(albus).then(function(result) {
      result = Number(result);
      return result;
    });

    assert.equal(galleonBalanceBefore, 0, "Token mint failed");
    assert.equal(galleonBalanceAfter, 1000, "Token mint failed");
  });
});

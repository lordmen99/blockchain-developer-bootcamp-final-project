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

  it("should enroll a new user", async () => {
    const enrolled = await instance.addUser( { from: albus } );
    let eventEmitted = false;

    if (enrolled.logs[0].event == "LogNewUser") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "should enroll a new user",
    );
  });

  it("should get a user's balance", async () => {
    await instance.addUser( { from: albus } );
    const balanceA = await instance.getBalance( { from: albus } );

    assert.equal(Number(balanceA), 0, "incorrect initial balance");
  });

  it("should let a user deposit funds and get their updated balance", async () => {
    const amount = 1E18;
    await instance.addUser( { from: bathilda } );
    const balanceB1 = await instance.getBalance( { from: bathilda } );  
    await instance.deposit( { from: bathilda, value: amount} );
    const balanceB2 = await instance.getBalance( { from: bathilda } );  

    assert.equal(Number(balanceB2), Number(balanceB1) + amount, "incorrect balance after deposit");
  });

  it("should emit a LogDeposit event after a deposit is made", async () => {
    const amount = 1E18;
    await instance.addUser( { from: bathilda } );
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

    await instance.addUser( { from: albus } );
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
    await instance.addUser( { from: bathilda } );
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

  it("should mint galleons to a user if a deposit is held", async () => {

    const amount = web3.utils.toWei('1','ether');
    await instance.addUser( { from: bathilda } );
    await instance.deposit( { from: bathilda, value: amount} );

    const galleonsBefore = await instance.getGalleons( {from: bathilda} );
    await tokenInstance.increaseAllowance(instance.address, 1000);

    await instance.mintGalleons(100, bathilda);
    
    const galleonsAfter = await instance.getGalleons( { from: bathilda } );

    assert.equal(Number(galleonsBefore), 0, "Token mint failed");
    assert.equal(Number(galleonsAfter), 100, "Token mint failed");

  });
});

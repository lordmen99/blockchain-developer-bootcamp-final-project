const Savings = artifacts.require("Savings");

contract("Savings", accounts => {
  const [_owner, alice, bob] = accounts;
  let instance; 

  beforeEach(async () => {
    instance = await Savings.new();
  });

  describe("Variables", () => {
    it("should have an owner", () => {
      assert.equal(typeof instance.owner, 'function', 'the contract has no owner');
    });

    describe("User struct", () => {
      let userStruct;
      
      // TODO create test-helper to deconstruct User struct props
      
      // before(() => {
      //   userStruct = Savings.structs.User;
      //   assert(
      //     userStruct !== null,
      //     "The contract should define an Struct called User"
      //   );
      // });

      it("should have an `enrolled` member", () => {});
      it("should have `balance` member", () => {});
      it("should have `timestamp` member", () => {});
      it("should have `withdrawalCount` member", () => {});
      it("should have `depositCount` member", () => {});
    });

    it("should have a `users` mapping", () => {});

  });

  describe("Use Cases", () => {
    it("should enroll a new user", () => {});

    it("should emit a LogNewUser event once a user is added", () => {});

    it("should get a user's balance", () => {});

    it("should let a user deposit funds and update their balance", () => {});

    it("should increment the deposit count by 1", () => {});

    it("should set the timestamp to the current block time after the first deposit", () => {});

    it("should emit a LogDeposit event after a deposit is made", () => {});

    it("should let a user withdraw funds and update their balance", () => {});

    it("should reset the timestamp after a withdrawal", () => {});

    it("should increment the withdrawal count by 1", () => {});

    it("should emit a LogWithdrawal event after a withdrawal is made", () => {});

  });
});

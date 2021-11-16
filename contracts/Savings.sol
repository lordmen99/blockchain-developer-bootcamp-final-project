// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Savings {

  address public owner = msg.sender;

  struct User {
    bool enrolled;
    uint balance;
    uint timestamp;
    uint withdrawalCount;
    uint depositCount;
  }

  mapping (address => User) private users;

  event LogNewUser(address accountAddress);
  event LogDeposit(address accountAddress, uint depositAmount);
  event LogWithdrawal(address accountAddress,uint withdrawalAmount, uint updatedBalance);

  // function () external payable {
  //     revert();
  // }

  function addUser() 
    public 
  {
    require(!users[msg.sender].enrolled, "User is enrolled");

    users[msg.sender] = User ({
      enrolled: true,
      balance: 0,
      timestamp: 0,
      withdrawalCount: 0,
      depositCount: 0
    });

    emit LogNewUser(msg.sender);
  }

  function getBalance() 
    public
    view
    returns (uint) 
  {
    return users[msg.sender].balance;
  }

  function deposit() 
    public
    payable
    returns (uint)
  {
    users[msg.sender].balance += msg.value;
    users[msg.sender].depositCount++;

    if(users[msg.sender].depositCount == 1 && users[msg.sender].withdrawalCount == 0) {
      users[msg.sender].timestamp = block.timestamp;
    }

    emit LogDeposit(msg.sender, msg.value);
    return (users[msg.sender].balance);
  }

  function withdraw(uint withdrawAmount)
    public
    payable
    returns (uint) 
  {
    require(users[msg.sender].balance >= withdrawAmount, "Insufficient funds");
    
    users[msg.sender].balance -= withdrawAmount;
    users[msg.sender].timestamp = 0;
    users[msg.sender].withdrawalCount++;
    
    // TODO: safe transfer

    emit LogWithdrawal(msg.sender, withdrawAmount, users[msg.sender].balance);
    return withdrawAmount;
  }
}

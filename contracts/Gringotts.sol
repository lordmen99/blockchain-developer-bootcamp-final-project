// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Gringotts is Ownable, Pausable {
  struct User {
    bool enrolled;
    uint balance;
    uint timestamp;
  }

  mapping (address => User) private users;

  event LogNewUser(address accountAddress);
  event LogDeposit(address accountAddress, uint depositAmount);
  event LogWithdrawal(address accountAddress,uint withdrawalAmount, uint updatedBalance);
  event LogBalance(uint balance);

  modifier isNewUser() {
    require(!users[msg.sender].enrolled, "User is already enrolled");
    _;
  }

  modifier hasFunds(uint withdrawalAmount) {
    require(users[msg.sender].balance >= withdrawalAmount, "Insufficient funds");
    _;
    
  }

  function addUser() 
    public
    isNewUser
  {
    
    users[msg.sender] = User ({
      enrolled: true,
      balance: 0,
      timestamp: 0,
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

  function getTimestamp() 
    public
    view
    returns(uint)
  {
    return users[msg.sender].timestamp;
  }

  function isEnrolled()
    public
    view
    returns(bool)
    {
      return users[msg.sender].enrolled;
    }

  function deposit() 
    public
    payable
    returns (uint)
  {
    if(users[msg.sender].timestamp == 0) {
      users[msg.sender].timestamp = block.timestamp;
    }

    users[msg.sender].balance += msg.value;

    emit LogDeposit(msg.sender, msg.value);
    return (users[msg.sender].balance);
  }

  function withdraw(uint withdrawalAmount)
    public
    payable
    hasFunds(withdrawalAmount)
    returns (uint) 
  {
    address payable _user = payable(msg.sender);
    users[msg.sender].balance -= withdrawalAmount;
    
    // Reset timestamp and increment withdrawal account
    users[msg.sender].timestamp = 0;

    _user.transfer(withdrawalAmount);
    
    emit LogWithdrawal(msg.sender, withdrawalAmount, users[msg.sender].balance);
    return users[msg.sender].balance;
  }

  /// @notice Pause the contract 
  /// @dev Circuit breaker pattern
  function pause() public onlyOwner {
      Pausable._pause();
  }

  /// @notice Resume the contract for both reads and writes
  /// @dev Circuit breaker pattern
  function unpause() public onlyOwner {
      Pausable._unpause();
  }
}

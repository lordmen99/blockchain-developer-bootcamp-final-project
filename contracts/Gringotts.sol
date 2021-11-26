// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Gringotts is Ownable, Pausable {
  
  IERC20 private _galleon;
  struct User {
    bool enrolled;
    uint balance;
    uint timestamp;
    uint galleons;
  }

  mapping (address => User) private users;

  event LogNewUser(address _accountAddress);
  event LogDeposit(address _accountAddress, uint _depositAmount);
  event LogWithdrawal(address _accountAddress,uint _withdrawalAmount, uint _updatedBalance);
  event LogBalance(uint _balance);
  event LogMintTokens(address _to, uint _galleons);

  constructor (IERC20 galleon) {
    _galleon = galleon;
  }

  modifier isNewUser() {
    require(!users[msg.sender].enrolled, "User is already enrolled");
    _;
  }

  modifier hasFunds(uint withdrawalAmount) {
    require(users[msg.sender].balance >= withdrawalAmount, "Insufficient funds");
    _; 
  }

  function addUser() public isNewUser {
    
    users[msg.sender] = User ({
      enrolled: true,
      balance: 0,
      timestamp: 0,
      galleons: 0
    });

    emit LogNewUser(msg.sender);
  }

  function deposit() public payable returns (uint) {
    
    if(users[msg.sender].timestamp == 0) {
      users[msg.sender].timestamp = block.timestamp;
    }

    users[msg.sender].balance += msg.value;

    emit LogDeposit(msg.sender, msg.value);
    return (users[msg.sender].balance);
  }

  function withdraw(uint withdrawalAmount) public payable hasFunds(withdrawalAmount) returns (uint) {
    address payable _user = payable(msg.sender);
    users[msg.sender].balance -= withdrawalAmount;
    
    // Reset timestamp and increment withdrawal account
    users[msg.sender].timestamp = 0;

    _user.transfer(withdrawalAmount);
    
    emit LogWithdrawal(msg.sender, withdrawalAmount, users[msg.sender].balance);
    return users[msg.sender].balance;
  }

  function mintGalleons(uint amount, address _to) external returns(uint) {
    
    require(users[_to].timestamp > 0, "No deposits held");
    
    address from = msg.sender;

    _galleon.transferFrom(from, _to, amount);

    users[_to].galleons += amount;
    emit LogMintTokens(_to,amount);

    return users[_to].galleons;
  }

  function getBalance() public view returns (uint) {
    return users[msg.sender].balance;
  }

  function getTimestamp() public view returns(uint) {
    return users[msg.sender].timestamp;
  }

  function getGalleons() public view returns(uint) {
    return users[msg.sender].galleons;
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
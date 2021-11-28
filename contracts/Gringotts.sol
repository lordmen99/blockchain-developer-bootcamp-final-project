// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Gringotts is Ownable, Pausable {
  
  IERC20 private galleon;

  mapping (address => uint) private balances;
  mapping (address => uint) private timestamp;
  

  event LogDeposit(address _accountAddress, uint _depositAmount);
  event LogWithdrawal(address _accountAddress,uint _withdrawalAmount, uint _updatedBalance);

  constructor (IERC20 _galleon) {
    galleon = _galleon;
  }

  modifier hasFunds(uint _amount) {
    require(balances[msg.sender] >= _amount, "Insufficient funds");
    _; 
  }

  modifier isHodler(address _to) {
    require((timestamp[_to] - 30 days) < block.timestamp, "Hasn't held funds long enough");
    _;
  }

  function deposit() public payable {
    
    if(timestamp[msg.sender] == 0 && balances[msg.sender] == 0) {
      timestamp[msg.sender] = block.timestamp;
    }

    balances[msg.sender] += msg.value;

    emit LogDeposit(msg.sender, msg.value);
  }

  function withdraw(uint _amount) public payable hasFunds(_amount) {
    address payable _user = payable(msg.sender);
    balances[msg.sender] -= _amount;
    
    // Reset timestamp
    timestamp[msg.sender] = 0;

    _user.transfer(_amount);
    
    emit LogWithdrawal(msg.sender, _amount, balances[msg.sender]);
  }

  function transferGalleonsToContract(uint amount) external onlyOwner {
    address from = msg.sender;

    galleon.transferFrom(from, address(this), amount);
  }

  function mintGalleonsToUser(address _to) public isHodler(_to) {
    galleon.transfer( _to, 1000);

    timestamp[_to] = 0;
  }

  function getBalance() external view returns (uint) {
    return balances[msg.sender];
  }

  function getTimestamp() external view returns(uint) {
    return timestamp[msg.sender];
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
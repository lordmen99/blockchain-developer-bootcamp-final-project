##Avoiding Common Attacks
**Using Specific Compiler Pragma**: Used `pragma solidity ^0.8.0` which has overflow checks and SafeMath built in  

**Use Modifiers Only for Validation**: onlyOwner modifiers used to control access to ERC20 token functions  

**Re-entrancy**: Used OpenZeppelin's reentrancy guard for the withdraw function in Gringotts.sol  
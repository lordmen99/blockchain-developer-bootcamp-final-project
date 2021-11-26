// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Galleon is ERC20 {
  constructor() ERC20("Galleons", "GAL") {
    _mint(msg.sender, 10000);
  }
}
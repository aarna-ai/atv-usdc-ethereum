// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TestToken is ERC20, ERC20Permit {
    constructor(
        address initialOwner
    )
        ERC20("Test Token", "TKN")
        ERC20Permit("Test Token")
    {}

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
}

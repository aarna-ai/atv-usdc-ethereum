// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {SafeERC20} from "./OwnableDelayModuleV2.sol";
import "./ERC20.sol";


contract PendleMock {
    using SafeERC20 for IERC20;
    IERC20 public rewardToken;

    function deposit(uint256 assets, address tok) public {
        IERC20(tok).safeTransferFrom(msg.sender, address(this), assets);
    }
}
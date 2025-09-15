// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StorageMock {

    mapping (address => uint256) public tvl;
    
    function calculatePoolInUsd(address token) external view returns(uint256){
        return tvl[token];
    }

    function updateTVL(address token, uint256 _tvl) external {
        tvl[token] = _tvl;
    }
}

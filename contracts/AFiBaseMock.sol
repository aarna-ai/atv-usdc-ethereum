// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20.sol";

interface IStorage {
    function increaseTVL(address token) external;
}

contract AFiBaseMock is  ERC20 {
    mapping(address => uint256) public depositUserNav;
    mapping(address => uint256) public shares;
    address public aFiStorage;
    address public PARENT_VAULT;
    address public depositToken;
    address[] uToken;

    address private constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    constructor(
        address initialOwner, address _depositToken
    )
        ERC20("Test Token", "TKN")
    {
        depositToken = _depositToken;
        uToken.push(depositToken);
    }

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }

    function setDepNAV(address user, uint256 nav) external {
        depositUserNav[user] = nav;
    }

    function setAFiStorage(address _aFiStorage) external {
        aFiStorage = _aFiStorage;
    }

    function deposit(uint256 amount, address rec) external {
        ERC20(depositToken).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, 10**18);
        // IStorage(aFiStorage).increaseTVL(address(this));
    }

    function getUTokens() external view returns (address[] memory uTokensArray){
        return uToken;
    }

    function stakeShares(address user, uint256 amount, bool lock) external {
        if (lock) {
            shares[user] += amount;
        } else {
            shares[user] -= amount;
        }
    }

    function withdraw( 
        uint _shares,
        address oToken,
        uint deadline,
        uint[] memory minimumReturnAmount,
        uint swapMethod,
        uint minAmountOut
    ) external {
        _burn(msg.sender, _shares);
        ERC20(depositToken).transfer(msg.sender, minAmountOut);
    } 

    function setParent(address parentVault) external {
        PARENT_VAULT = parentVault;
    }

    function migrate() external {
        _totalSupply += ERC20(PARENT_VAULT).totalSupply();
    }

    function exchangeToken() external {
        uint256 bal = ERC20(PARENT_VAULT).balanceOf(msg.sender);
        require(bal > 0);
        ERC20(PARENT_VAULT).transferFrom(msg.sender, DEAD_ADDRESS, bal);
        _balances[msg.sender] += bal;
        emit Transfer(address(0), msg.sender, bal);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20.sol";

contract AFiOracleMock is  ERC20 {
    mapping(address => uint256) public depositUserNav;
    mapping(address => uint256) public shares;
    uint256 public _pauseDepositFees;
    address public aFiStorage;
    address public PARENT_VAULT;

    struct SwapParameters {
        address afiContract;
        address oToken;
        uint256 cSwapFee;
        uint256 cSwapCounter;
        address[] depositTokens;
        uint256[] minimumReturnAmount;
        uint256[] iMinimumReturnAmount; // minimum amount out expcted after swaps For deposit tokens
        address[] underlyingTokens;
        uint256[] newProviders;
        uint _deadline;
        address[] cometToClaim;
        address[] cometRewardTokens;
        uint256[] rewardTokenMinReturnAmounts;
    }

    struct SwapDataStructure {
        bytes[] firstIterationUnderlyingSwap;
        bytes[] secondIterationUnderlyingSwap;
        bytes[] firstIterationCumulativeSwap;
        bytes[] secondIterationCumulativeSwap;
    }


    address private constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    constructor(
        address initialOwner
    )
        ERC20("Test Token", "TKN")
    {}

    function cumulativeSwap(SwapParameters memory params, uint256 pauseDepositFees, SwapDataStructure calldata dexdata, bytes[] calldata cometSwapData, uint256 minAmountOut) external{
      _pauseDepositFees = pauseDepositFees;
    }

    function setDepNAV(address user, uint256 nav) external {
        depositUserNav[user] = nav;
    }

    function setAFiStorage(address _aFiStorage) external {
        aFiStorage = _aFiStorage;
    }

    function stakeShares(address user, uint256 amount, bool lock) external {
        if (lock) {
            shares[user] += amount;
        } else {
            shares[user] -= amount;
        }
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

    function getPriceInUSD(address tok) external pure returns (uint256, uint256){
        return(100000000, 8);
    }

}

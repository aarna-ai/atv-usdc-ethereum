// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import {IERC20Extended as IERC20} from "./IERC20Extended.sol";
import "./IAFiStorage.sol";
import "./IPassiveRebal.sol";

/**
 * @title PassiveRebal.
 * @notice Interface of the Passive Rebalance contract.
 */
interface PassiveRebal {
  function applyRebalForProportions(
    address _aFiContract,
    address _aFiManager,
    address _aFiStorage,
    address[] memory _tokens,
    uint256 strategy
  ) external returns (uint[] memory proportions, uint256);

  function getPauseStatus() external returns (bool);

  function setPassiveRebalancedStatus(address aFiContract, bool status) external;

  function isAFiPassiveRebalanced(
    address aFiContract
  ) external returns (bool _isPassiveRebalanced);

  function getRebalStrategyNumber(address aFiContract) external returns (uint);
}

interface IAFiOracle {
  function uniswapV3Oracle(
    address afiContract,
    address _tokenIn,
    address _tokenOut,
    uint _amountIn,
    uint _maxTime,
    address middleToken,
    uint256 minimumReturnAmount
  ) external returns (bytes memory swapParams);
}

interface IAFiManager {
  function updateUTokenProportion(
    address aFiContract,
    address aFiStorage
  ) external returns (uint256[] memory);

  function inputTokenUSD(
    IAFi aFiContract,
    uint256 cSwapCounter,
    IAFiStorage _aFiStorage
  ) external view returns (uint256 totalPreDepositInUSD);

  function intializeData(
    address aFiContract,
    address[] memory underlyingTokens,
    uint[] memory underlyingProportion
  ) external;

  function uTokenslippage(
    address aFiContract,
    address uToken
  ) external view returns (uint uTokenSlippage);
}

/**
 * @title IAFi.
 * @notice Interface of the AToken.
 */
interface IAFi {

  struct UnderlyingData {
    address[] _underlyingTokens; //uTokens
    address[] _underlyingUniPoolToken; //uToken - MiddleToken
  }

  struct PoolsData {
    address[] _depositStableCoin;
    address[] _depositCoinOracle;
    bytes underlyingData;
    address[] _compound;
    address[] _aaveToken;
    address[] _priceOracles;
    uint[] _underlyingTokensProportion;
    address[] compoundV3Comet;
    uint _typeOfProduct;
  }


  /**
   * @param account Address of the account that paused the contract.
   * @param isDeposit True if we want to pause deposit otherwise false if want to pause withdraw.
   */
  event Paused(address account, bool isDeposit);
  /**
   * @param account Address of the account that unpaused the contract.
   * @param isDeposit True if we want to unpause deposit otherwise false if want to unpause withdraw.
   */
  event Unpaused(address account, bool isDeposit);

  /**
   * @notice Function to initialize the data, owner and afi token related data.
   * @dev the function should be called once only by factory
   * @param newOwner indicates the owner of the created afi product.
   * @param _name indicates the name of the afi Token
   * @param _symbol indicates symbol of the the afi Token.
   * @param data indicates the encoded data that follows the PoolsData struct format.
   * @param _isActiveRebalanced indicates the active rebalance status of the afi contract.
   * @param _aFiStorage indicates the afi storage contract address.
   */
  function initialize(
    address newOwner,
    string memory _name,
    string memory _symbol,
    bytes memory data,
    bool _isActiveRebalanced,
    IAFiStorage _aFiStorage,
    address[] memory _commonInputTokens
  ) external;

  /**
   * @notice Function to initialize accepted tokens in deposit and withdraw functions.
   * @dev  the function should be called once only by factory
   * @param iToken indicates the array of the accepted token addressess.
   */
  function initializeToken(
    address[] memory iToken,
    address[] memory _teamWallets,
    IPassiveRebal _rebalContract,
    bool _isPassiveRebalanced,
    address _aFiManager
  ) external;

  function getcSwapCounter() external view returns(uint256);

  /**
   * @notice Returns the array of underlying tokens.
   * @return uTokensArray Array of underlying tokens.
   */
  function getUTokens() external view returns (address[] memory uTokensArray);

  function swapViaStorageOrManager(
    address from,
    address to,
    uint amount,
    uint deadline,
    address midTok,
    uint minimumReturnAmount
  ) external returns (uint256);

  /**
   * @notice Returns the paused status of the contract.
   */
  function isPaused() external view returns (bool, bool);

  function getProportions()
    external
    view
    returns (uint[] memory, uint[] memory);

  /**
   * @notice Updates the pool data during Active Rebalance.
   * @param data that follows PoolsData format indicates the data of the token being rebalanced in Active Rebalance.
   */
  function updatePoolData(bytes memory data) external;

  function sendProfitOrFeeToManager(
    address wallet,
    uint profitShare,
    address oToken
  ) external;

  function totalSupply() external view returns (uint);

  function _supplyCompV3(address tok, uint amount) external;

  function _supplyAave(address tok, uint amount) external;

  function _supplyCompound(address tok, uint amount) external;

  function _withdrawAave(address tok, uint amount) external;

  function _withdrawCompoundV3(address tok, uint amount) external;

  function _withdrawCompound(address tok, uint amount) external;

  function getTVLandRebalContractandType()
    external
    view
  returns (uint256, address, uint256);

  function getInputToken() external view returns (address[] memory, address[] memory);

  function swap(
    address inputToken,
    address uTok,
    uint256 amountAsPerProportion,
    uint _deadline,
    address middleToken,
    uint256 minimumReturnAmount
  ) external returns (uint256);

  function updateDp(
    uint256[] memory _defaultProportion,
    uint256[] memory _uTokensProportion,
    uint256 activeStrategy
  ) external;

  function updateuTokAndProp(
    address[] memory _uTokens
  ) external;

  function underlyingTokensStaking(address[] memory _depositTokens) external returns(uint256 _totalProp);

  function depositUserNav(address user) external view returns (uint256);

  function setUnstakeData(uint256 totalQueuedShares) external returns (address[] memory, address[] memory, uint256, uint256);

  function isOTokenWhitelisted(address oToken) external view returns (bool);

  function validateWithdraw(address user, address oToken, uint256 _shares) external view returns( uint ibalance);

  function updateLockedTokens(address user, uint256 amount, bool lock, bool updateBalance) external;

  function getVaultDetails() external view returns(string memory, string memory);

  function checkTVL(bool _updateTVL) external;

  function updateInputTokens(address[] memory _inputTokens) external;
}
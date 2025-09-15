// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableDelayModuleV2} from "./OwnableDelayModuleV2.sol";
import {IERC20Extended as IERC20} from "./IERC20Extended.sol";
import {SafeERC20} from "./SafeERC20.sol";
import "./ArrayUtils.sol";

interface IStandardizedYieldAdapter {
    function PIVOT_TOKEN() external view returns (address);
    function getAdapterTokensDeposit() external view returns (address[] memory);
    function getAdapterTokensRedeem() external view returns (address[] memory);
    function convertToDeposit(address tokenIn, uint256 amountIn) external returns (uint256);
    function convertToRedeem(address tokenOut, uint256 amountIn) external returns (uint256);
    function previewConvertToDeposit(address tokenIn, uint256 amountIn) external view returns (uint256);
    function previewConvertToRedeem(address tokenOut, uint256 amountIn) external view returns (uint256);
}

interface IAFi {
    
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

    function deposit(
        uint amount, 
        address iToken
    ) external;

    function getInputToken(
    ) external view returns (address[] memory, address[] memory);

    function withdraw(
        uint _shares,
        address oToken,
        uint deadline,
        uint[] memory minimumReturnAmount,
        uint swapMethod,
        uint minAmountOut
    ) external;

    function getUTokens() external view returns (address[] memory uTokensArray);

    function pauseUnpauseDeposit(bool status) external;
    
    function totalSupply() external view returns (uint256);
    
    function totalAssets() external view returns (uint256);

    function getcSwapCounter() external view returns(uint256);

}

interface IAFiOracle {
    function cumulativeSwap(
        IAFi.SwapParameters memory params, 
        uint256 pauseDepositFees, 
        IAFi.SwapDataStructure calldata dexdata, 
        bytes[] calldata cometSwapData, 
        uint256 minAmountOut
    ) external;

    function getPriceInUSD(address tok) external view returns (uint256, uint256);
}

interface IAFiStorage{
    function provider(address _atvVault, address token) external view returns(uint); // Protocol where each u token is invested
    function calculatePoolInUsd(address afiContract) external view returns (uint);
    function calculateRedemptionFromContract(address afiContract, address tok, uint256 r) external view returns ( 
        uint256 price,
        bool stakedStatus,
        uint256 redemptionValueFromContract,
        uint256 multiplier,
        uint256 tvl
    );

    function getPreSwapDepositsTokens(
    address aFiContract,
    uint256 _cSwapCounter,
    address stableToken
  ) external view returns (uint256);

   function calcPoolValue(
    address tok,
    address afiContract
  ) external view returns (uint);
}

/**
 * @title SYAtvAdapter
 * @notice Standardized Yield (SY) Adapter for atv111 vault
 * @dev This SY adapter handles conversion between ERC20 tokens and atv111 shares
 * 
 * Architecture:
 * User has: ERC20 tokens (like USDC)
 * SY Adapter converts: ERC20 tokens → atv111 tokens (AtvWrappedBoosterTL shares)
 * Pendle SY holds: atvUSDC tokens
 * User gets: Pendle SY tokens
 */
contract SYAtvAdapter is IStandardizedYieldAdapter, OwnableDelayModuleV2{
    using SafeERC20 for IERC20;
    using ArrayUtils for address[];

    /// @notice The AtvWrappedBoosterTL vault contract (ERC4626)
    IAFi public immutable ATV_VAULT;
    address public atvOracle;
    address public atvStorage;

    uint256 public deadlineDelay = 1 hours;
    
    /// @notice ERC20 tokens
    address[] public VAULT_TOKENS;
    address[] public iToken;
    address[] public uToken;

    mapping(address => address) internal cSwapController;
    mapping(address => address) internal pauseDepController;
    
    event ConvertToDeposit(address atvVault, address indexed caller, address tokenIn, uint256 amountIn, uint256 atvSharesReceived);
    event ConvertToRedeem(address atvVault, address indexed caller, address tokenOut, uint256 amountIn, uint256 tokenReceived);
    event CumulativeSwap(address indexed atvVault, IAFi.SwapParameters params, uint256 pauseDepositFees, IAFi.SwapDataStructure dexdata, bytes[] cometSwapData, uint256 minAmountOut);
    event SetATVOracle(address _atvOracle);
    event SetDeadlineDelay(uint256 _deadlineDelay);
    event SetATVStorage(address _atvStorage);
    event UpdateVaultControllers(address indexed afiContract, address _cumulativeSwapController);
    event SetPauseDepController(address indexed atvVault, address controller);
    event SetPauseUnpauseDeposit(address indexed atvVault, bool _status);

    /**
     * @notice Constructor for the SY Adapter
     * @param _atvVault Address of the AtvWrappedBoosterTL vault (ERC4626)
     */
    constructor(address _atvVault, address _atvOracle) {
        require(_atvVault != address(0) && _atvOracle != address(0), "Invalid ATV vault address");
        
        ATV_VAULT = IAFi(_atvVault);
        (VAULT_TOKENS, ) = IAFi(ATV_VAULT).getInputToken(); // The vault ERC20 tokens
        
        // Verify the setup is correct
        require(VAULT_TOKENS.length != 0, "Invalid vault tokens");
        atvOracle = _atvOracle;

    }

    /**
     * @notice Returns the pivot token for ERC4626-based SY
     * @dev For ERC4626-based SY, this should return the underlying asset (vault ERC20 tokens)
     * @return The vault ERC20 tokens address
     */
    function PIVOT_TOKEN() external view override returns (address) {
        return address(ATV_VAULT);
    }

    /**
     * @notice Returns the list of tokens that can be deposited
     * @dev Returns all vault tokens that can be deposited into the ATV vault
     * @return Array of token addresses that can be deposited
     */
    function getAdapterTokensDeposit() external view override returns (address[] memory) {
        return VAULT_TOKENS;
    }

    /**
     * @notice Returns the list of tokens that can be redeemed
     * @dev Returns all vault tokens that can be received when redeeming from the ATV vault
     * @return Array of token addresses that can be redeemed
     */
    function getAdapterTokensRedeem() external view override returns (address[] memory) {
        return VAULT_TOKENS;
    }

    /**
     * @notice Preview the approximate amount of ATV shares that would be received for a given deposit
     * @dev This function simulates the deposit without actually executing it
     * @param tokenIn The token to deposit
     * @param amountIn The amount of tokens to deposit
     * @return The estimated amount of ATV shares that would be received
     */
    function previewConvertToDeposit(address tokenIn, uint256 amountIn) external view override returns (uint256) {
        (, bool istok) = VAULT_TOKENS.indexOf(tokenIn);
        require(istok, "Unsupported token");
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 shares;
        // Deduct 1% fee from amountIn
        uint256 amountAfterFee = (amountIn * 99) / 100;

        (uint256 price, uint256 dec) = IAFiOracle(atvOracle).getPriceInUSD(tokenIn);
        uint decimals = IERC20(tokenIn).decimals();
        require(18 >= decimals, "ASY01");
        decimals =  (18 - decimals);
        uint256 amountCheck = (amountAfterFee * price * (10 ** decimals)) / (10 ** dec);

        uint256 _totalSupply = IAFi(ATV_VAULT).totalSupply();

        uint256 prevPool = IAFiStorage(atvStorage).calculatePoolInUsd(address(ATV_VAULT));

        if (_totalSupply == 0) {
            shares = amountCheck / 100;
            } else {
            require(prevPool > 0, "ASY02");
            shares = (amountCheck * _totalSupply) / prevPool;
        } 
        
        return shares;
    }

    /**
     * @notice Preview the approximate amount of tokens that would be received for redeeming shares
     * @dev This function simulates the redemption without actually executing it
     * @param tokenOut The token to receive
     * @param amountIn The amount of ATV shares to redeem
     * @return The estimated amount of tokens that would be received
     */
    function previewConvertToRedeem(address tokenOut, uint256 amountIn) external view override returns (uint256) {
        (, bool istok) = VAULT_TOKENS.indexOf(tokenOut);
        require(istok, "Unsupported token");
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 redemptionValueFromContract;
        
        uint256 vaultTvl = IAFiStorage(atvStorage).calculatePoolInUsd(address(ATV_VAULT));

        require((IAFi(ATV_VAULT).totalSupply()) > 0, "ASY03");
        
        uint r = (vaultTvl * (amountIn)) / (IAFi(ATV_VAULT).totalSupply());

        (uint256 price, uint256 multiplier) = IAFiOracle(atvOracle).getPriceInUSD(tokenOut);
       
        uint256 tokPreDep = IAFiStorage(atvStorage).getPreSwapDepositsTokens(address(ATV_VAULT), IAFi(ATV_VAULT).getcSwapCounter(), tokenOut);
        
        if (price != 0) {
      
            uint decimals = IERC20(tokenOut).decimals();
            require(18 >= decimals, "ASY01");
            decimals =  (18 - decimals);

            uint256 tokPredepInUSD = (tokPreDep) * (uint(price));

            tokPredepInUSD = ((tokPredepInUSD * (10 ** decimals)) / (10 ** multiplier));

            redemptionValueFromContract = (((r) *
                (IAFiStorage(atvStorage).calcPoolValue(tokenOut, address(ATV_VAULT)) - tokPredepInUSD)) * (10 ** multiplier));
        
            redemptionValueFromContract =
                (redemptionValueFromContract) /
                (((vaultTvl - tokPredepInUSD) * (uint(price)) * (10 ** decimals)));
        }
    
        return redemptionValueFromContract;

    }

    function convertToDeposit(address tokenIn, uint256 amountIn) external override returns (uint256) {
        (, bool istok) = VAULT_TOKENS.indexOf(tokenIn);
        require(istok, "Unsupported token");
        require(amountIn > 0, "Amount must be greater than 0");
        
        // Approve the ATV vault to spend the vault tokens
        IERC20(tokenIn).approve(address(ATV_VAULT), amountIn);
        uint256 atvSharesReceived =  IERC20(address(ATV_VAULT)).balanceOf(address(this));
        
        // Deposit vault tokens to ATV vault and receive atv111 shares
        // The ATV vault's deposit function mints atv111 shares to this contract
        ATV_VAULT.deposit(amountIn, tokenIn);
        performCS(tokenIn);
        atvSharesReceived = (IERC20(address(ATV_VAULT)).balanceOf(address(this)) - atvSharesReceived);
        
        require(atvSharesReceived > 0, "Nothing Recievd"); 
        // Transfer the atv111 shares to the Pendle SY contract (msg.sender)
        IERC20(address(ATV_VAULT)).safeTransfer(msg.sender, atvSharesReceived);
        IERC20(tokenIn).approve(address(ATV_VAULT), 0);
        emit ConvertToDeposit(address(ATV_VAULT), msg.sender, tokenIn, amountIn, atvSharesReceived);
      
        return atvSharesReceived;
    }

    function performCS(address inToken) internal {
        ATV_VAULT.pauseUnpauseDeposit(true);
        (iToken, ) = IAFi(ATV_VAULT).getInputToken();
        uint deadline = block.timestamp + deadlineDelay; //
        IAFi.SwapParameters memory params = IAFi.SwapParameters({
            afiContract : address(ATV_VAULT),
            oToken : inToken,
            cSwapFee : 0,
            cSwapCounter : 0,
            depositTokens : iToken,
            minimumReturnAmount : _getMinReturnAmounts(),
            iMinimumReturnAmount : _getMinReturnAmounts(), // minimum amount out expcted after swaps For deposit tokens
            underlyingTokens : ATV_VAULT.getUTokens(),
            newProviders: _getProviders(),
            _deadline : deadline,
            cometToClaim : new address[](0),
            cometRewardTokens : new address[](0),
            rewardTokenMinReturnAmounts : new uint256[](0)
        });
 
        bytes[] memory swapData = new bytes[](0);  
        bytes[] memory swapDataSecondIteration = new bytes[](1);          

        IAFi.SwapDataStructure memory swapParam = IAFi.SwapDataStructure ({
            firstIterationUnderlyingSwap : swapData,
            secondIterationUnderlyingSwap : swapData,
            firstIterationCumulativeSwap : swapData,
            secondIterationCumulativeSwap : swapDataSecondIteration
        });

        IAFiOracle(atvOracle).cumulativeSwap(
            params, 
            0, 
            swapParam, 
            swapData, 
            0
        );
    }

    function cumulativeSwap(IAFi.SwapParameters memory params, uint256 pauseDepositFees, IAFi.SwapDataStructure calldata dexdata, bytes[] calldata cometSwapData, uint256 minAmountOut) external {
        require(msg.sender == cSwapController[params.afiContract], "NA");
        IAFiOracle(atvOracle).cumulativeSwap(
            params, 
            pauseDepositFees, 
            dexdata, 
            cometSwapData, 
            minAmountOut
        );
        emit CumulativeSwap(params.afiContract, params, pauseDepositFees, dexdata, cometSwapData, minAmountOut);
    }

    function setATVOracle(address _atvOracle) external onlyOwner {
        require(_atvOracle != address(0), "Zero address");
        atvOracle = _atvOracle;
        emit SetATVOracle(_atvOracle);
    }

    function setDeadlineDelay(uint256 _deadlineDelay) external onlyOwner {
        require(_deadlineDelay > 0, "Zero delay");
        deadlineDelay = _deadlineDelay;
        emit SetDeadlineDelay(_deadlineDelay);
    }

    function setATVStorage(address _atvStorage) external onlyOwner {
        require(_atvStorage != address(0), "Zero address");
        atvStorage = _atvStorage;
        emit SetATVStorage(_atvStorage);
    }

    function updateVaultControllers(
        address afiContract,
        address _cumulativeSwapController
    ) external onlyOwner {
        require(afiContract != address(0) && _cumulativeSwapController != address(0), "zero address");
        cSwapController[afiContract] = _cumulativeSwapController;
        emit UpdateVaultControllers(afiContract, _cumulativeSwapController);
    }

    function setPauseDepController(address atvVault, address controller) external onlyOwner{
        require(atvVault != address(0) && controller != address(0), "zero address");
        pauseDepController[atvVault] = controller;
        emit SetPauseDepController(atvVault, controller);
    }

    function getControllers(
        address afiContract
    ) external view returns (address, address) {
        return (cSwapController[afiContract], pauseDepController[afiContract]);
    }

    function setPauseUnpauseDeposit(address atvVault, bool _status) external {
        require(msg.sender == pauseDepController[atvVault], "NA");
        IAFi(atvVault).pauseUnpauseDeposit(_status);
        emit SetPauseUnpauseDeposit(atvVault, _status);
    }

    function convertToRedeem(address tokenOut, uint256 amountIn) external override returns (uint256) {
       (, bool istok) = VAULT_TOKENS.indexOf(tokenOut);
        require(istok, "Unsupported token");
        require(amountIn > 0, "Amount must be greater than 0");

        uint256 vaultTokensReceived =  IERC20(address(tokenOut)).balanceOf(address(this));
        uint deadline = block.timestamp + deadlineDelay; // or some meaningful time
        uint[] memory minimumReturnAmount = _getMinReturnAmounts();
        
        // Withdraw from ATV vault - this burns atv111 shares and returns vault tokens
        // The vault tokens are sent directly to the Pendle SY contract (msg.sender)
        ATV_VAULT.withdraw(
            amountIn, 
            tokenOut,
            deadline,
            minimumReturnAmount,
            3,
            0
        );        

        vaultTokensReceived = IERC20(address(tokenOut)).balanceOf(address(this)) - vaultTokensReceived;
        require(vaultTokensReceived > 0, "Nothing Recievd"); 

        IERC20(tokenOut).safeTransfer(msg.sender, vaultTokensReceived);
        emit ConvertToRedeem(address(ATV_VAULT), msg.sender, tokenOut, amountIn, vaultTokensReceived);
      
        return vaultTokensReceived;
    }

    function _getMinReturnAmounts() internal view returns (uint256[] memory) {
        uint256 ulen = ATV_VAULT.getUTokens().length;
        uint256[] memory minReturnAmount = new uint256[](ulen);
        return minReturnAmount;
    }

    function _getProviders() internal view returns (uint[] memory) {
        uint256 ulen = ATV_VAULT.getUTokens().length;
        address[] memory uTokens = new address[](ulen);
        uint256[] memory providers = new uint256[](ulen);
        uTokens = ATV_VAULT.getUTokens();
        for (uint i; i< ulen; i++){
            providers[i] = IAFiStorage(atvStorage).provider(address(ATV_VAULT), uTokens[i]);
        }
        return providers;
    }
}
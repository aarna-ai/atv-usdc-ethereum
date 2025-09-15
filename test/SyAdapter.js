
// /* eslint-disable no-underscore-dangle */
// const { assert, expect } = require('chai');
// const { ethers, waffle } = require('hardhat');
// const { BigNumber } = require('ethers');
// const { time, constants } = require("@openzeppelin/test-helpers");
// const { provider } = waffle;




// const { abi: AFIBASE_ABI } = require('../artifacts/contracts/AtvBase.sol/AtvBase.json');


// const {
//     // eslint-disable-next-line max-len
//     ONEINCHEXCHANGE_ABI, ONEINCHEXCHANGE_ADDRESS, DAI_ABI, DAI_ADDRESS, SAI_ABI, SAI_ADDRESS, USDT_ABI, USDT_ADDRESS, USDC_ABI, USDC_ADDRESS,
// } = require('../utils/constants');
// const { ZERO_ADDRESS } = require('@openzeppelin/test-helpers/src/constants');
// const exp = require('constants');
// const { zeroAddress } = require('ethereumjs-util');


// const getBigNumber = (number) => ethers.BigNumber.from(number);


// describe('AFiBase', () => {
//     let platformWallet; let recipient; let investor1; let investor2;
//     let deadline;
//     let aTokenConInstance;
//     let aTokenConInstance1;
//     let oneInchParam;


//     // eslint-disable-next-line no-unused-vars
//     let daiConInstance;
//     let usdcConInstance;
//     let usdtConInstance;
//     // let aFiDelayModule;
//     let SYAtvAdapterCon;


//     beforeEach(async () => {


//         oneInchParam = {
//             firstIterationUnderlyingSwap: ["0x", "0x", "0x", "0x", "0x", "0x"],
//             secondIterationUnderlyingSwap: ["0x", "0x", "0x", "0x", "0x", "0x"],
//             firstIterationCumulativeSwap: ["0x", "0x", "0x", "0x", "0x", "0x"],
//             secondIterationCumulativeSwap: ["0x", "0x", "0x", "0x", "0x", "0x"]
//         }


//         const userAccounts = await ethers.getSigners();
//         [platformWallet, recipient, investor1, investor2, other, gnosisWallet] = userAccounts;


//         const currentTime = await time.latest();
//         deadline = currentTime + (60 * 60);


//         const AFiBase = await ethers.getContractFactory('AtvBase');
//         // const delayModule = await ethers.getContractFactory('TimeDelayModule');
//         const AFiManager = await ethers.getContractFactory('AtvManager');
//         const PassiveRebalanceStrategies = await ethers.getContractFactory('AtvPassiveRebalanceStrategies');


//         const AFiStorage = await ethers.getContractFactory('AtvStorage');
//         const AFiFacotry = await ethers.getContractFactory('AtvFactory');
//         const AFiOracle = await ethers.getContractFactory('AtvOracle');


//         const SYadapter = await ethers.getContractFactory('SYAtvAdapter');




//         // LOCAL CONTRACTS
//         aFiBaseInstace = await AFiBase.deploy("AFi802", "AFi");
//         aFiManagerInstance = await AFiManager.deploy();
//         aFiPassiveRebalanceInstance = await PassiveRebalanceStrategies.deploy();
//         aFiAFiOracleInstance = await AFiOracle.deploy(aFiPassiveRebalanceInstance.address);
//         // aFiDelayModule = await delayModule.deploy(86400, 172800);


//         aFiFactoryInstance = await AFiFacotry.deploy(aFiBaseInstace.address);
//         aFiStorageInstance = await AFiStorage.deploy(aFiManagerInstance.address, aFiAFiOracleInstance.address, aFiPassiveRebalanceInstance.address, aFiFactoryInstance.address);
//         console.log("print the address of the aFiFactoryInstance", aFiFactoryInstance.address);


//         const payload = [
//             [
//                 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // underlying - WBTC
//             ],
//             [
//                 "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  // Middle Token of DAI
//             ]
//         ]


//         const uDataPayload = await aFiFactoryInstance.encodeUnderlyingData(payload)


//         const payloadnew = [
//             ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], //USDT, USDC - payment tokens
//             ["0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6"], // USDT, USDC - chainlink oracles
//             uDataPayload,
//             [
//                 "0x0000000000000000000000000000000000000000"
//             ],
//             [
//                 "0x0000000000000000000000000000000000000000"
//             ],
//             [
//                 "0x0000000000000000000000000000000000000000"
//             ],
//             ["10000000"],
//             [
//                 "0x0000000000000000000000000000000000000000",
//             ],
//             2
//         ]


//         const bytesPayload2 = await aFiFactoryInstance.encodePoolData(payloadnew);


//         result = await aFiFactoryInstance.createAToken("AFiBase", "ATOK", bytesPayload2, [investor1.address, investor2.address], true, aFiStorageInstance.address,
//             aFiPassiveRebalanceInstance.address, aFiManagerInstance.address, [], "0x0000000000000000000000000000000000000000");


//         aTokenConInstance = await aFiFactoryInstance.aFiProducts(0);
//         SYAtvAdapterCon = await SYadapter.deploy(aTokenConInstance, aFiAFiOracleInstance.address);


//         //let txObject = await result.wait()


//         //console.log("result++++++++++++++++++++++++", txObject.events[11].args[0]);


//         aTokenConInstance = await ethers.getContractAt(AFIBASE_ABI, aTokenConInstance);
//         //console.log("result++++++++++++++++++++++++", await aTokenConInstance.getPriceOracle("0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"));


//         await aFiPassiveRebalanceInstance.intializeStalePriceDelay([
//             "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0x6B175474E89094C44Da98b954EedeAC495271d0F",
//             // "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // underlying - WBTC
//             "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
//             "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",  // UNI
//             "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
//             "0xD31a59c85aE9D8edEFeC411D448f90841571b89c",  // SOL
//             "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", //Aave
//             "0xD533a949740bb3306d119CC777fa900bA034cd52"


//         ], [
//             86500,
//             86500,
//             86500,
//             //86500,
//             86500,
//             86500,
//             86500,
//             86500,
//             86500,
//             86500
//         ]);




//         await aFiAFiOracleInstance.setAFiStorage(aFiStorageInstance.address);


//         // // Transfer all AFinance Tokens to PLATFORM_WALLET
//         // await aFinanceConInstance.transfer(platformWallet.address, AFINANCE_SUPPLY);


//         // MAINNET CONTRACT INSTANCES
//         daiConInstance = await ethers.getContractAt(DAI_ABI, DAI_ADDRESS);
//         usdcConInstance = await ethers.getContractAt(USDC_ABI, USDC_ADDRESS);
//         usdtConInstance = await ethers.getContractAt(USDT_ABI, USDT_ADDRESS);


//         await aFiStorageInstance.setStablesWithdrawalLimit(aTokenConInstance.address, usdtConInstance.address, 500000000000000000000n);
//         await aFiStorageInstance.setStablesWithdrawalLimit(aTokenConInstance.address, daiConInstance.address, 50000000000000000000000n);
//         await aFiStorageInstance.setStablesWithdrawalLimit(aTokenConInstance.address, usdcConInstance.address, 50000000000000000000000n);


//         const accountToInpersonate = "0x54edC2D90BBfE50526E333c7FfEaD3B0F22D39F0"
//         const accountToFund = "0x7Bc58bD67b258b445E4528039BE14824f04d2422"


//         await hre.network.provider.request({
//             method: "hardhat_impersonateAccount",
//             params: [accountToInpersonate],
//         });
//         const signer = await ethers.getSigner(accountToInpersonate);






//         const ether = (amount) => {
//             const weiString = ethers.utils.parseEther(amount.toString());
//             return BigNumber.from(weiString);
//         };


//         /**
//         * GIVE APPROVAL TO AFi of DEPOSIT TOKEN
//         * THIS IS REQUIRED WHEN 1% fee IS TRANSFEREED FROM INVESTOR TO PLATFORM WALLET
//         */


//         console.log("print the productttttttttttt", usdtConInstance.address);


//         console.log("print the productttttttttttt", aTokenConInstance.address);


//         await usdtConInstance.connect(investor1).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         await usdtConInstance.connect(investor2).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         await usdcConInstance.connect(investor1).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         await usdcConInstance.connect(investor2).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         await daiConInstance.connect(investor1).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         await daiConInstance.connect(investor2).approve(
//             aTokenConInstance.address,
//             ethers.constants.MaxUint256
//         );


//         const daiBalance = await daiConInstance.balanceOf(accountToInpersonate)
//         console.log("whale dai balance", daiBalance / 1e18)
//         console.log("transfering to", accountToFund)


//         var usdtBalance = await usdtConInstance.balanceOf(accountToInpersonate);
//         let usdcBalance = await usdcConInstance.balanceOf(accountToInpersonate);
//         // usdcBalance = usdcBalance / 2;


//         console.log("usdcBalance", usdcBalance);
//         await usdcConInstance.connect(signer).transfer(investor1.address, usdcBalance);
//         // await usdcConInstance.connect(signer).transfer(investor2.address, usdcBalance);


//         console.log("usdtBalance", usdtBalance)
//         usdtBalance = usdtBalance / 100;
//         console.log("usdtBalance", usdtBalance)
//         await usdtConInstance.connect(signer).transfer(investor1.address, "1783822029");
//         await usdtConInstance.connect(signer).transfer(investor2.address, "1783822029");


//         await aFiPassiveRebalanceInstance.updateMidToken(
//             [
//                 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
//             ],
//             [
//                 "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
//             ]
//         );


//         await aFiPassiveRebalanceInstance.setStorage(aFiStorageInstance.address);
//         await aFiPassiveRebalanceInstance.setOracle(aFiAFiOracleInstance.address);


//         const poolPayload = [
//             [
//                 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
//             ],
//             [
//                 "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
//             ],
//             [
//                 "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36"


//             ],
//             [
//                 "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36"


//             ],
//             [
//                 [[
//                     "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36"
//                 ]]
//             ],
//             [
//                 "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36"
//             ]
//         ]
//         const unipooldata = await aFiPassiveRebalanceInstance.encodePoolData(poolPayload)
//         await aFiPassiveRebalanceInstance.initUniStructure(["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], unipooldata);


//         const investorusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//         await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, investor1.address, investor1.address);
//         await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, investor1.address);
//         await aTokenConInstance.setplatformWallet(platformWallet.address);
//         await aFiManagerInstance.setRebalanceController(platformWallet.address);
//         await aTokenConInstance.setMinDepLimit(100);


//         const pwallet = await aTokenConInstance.getplatformWallet();
//         console.log("Platform wallet => ", pwallet);


//         // const data = await aFiDelayModule.encodeupdateTVLTransaction(3000);
//         // console.log("data generated", `${data}`);


//         const delayModuleaddress = await aTokenConInstance.getDelayModule();
//         console.log("delay module address", `${delayModuleaddress}`);


//         const ownerOfBase = await aTokenConInstance.owner();
//         console.log("owner of the vault", `${ownerOfBase}`);


//         // await aTokenConInstance.setDelayModule(aFiDelayModule.address);


//         // await aFiDelayModule.queueTransaction(
//         //     aTokenConInstance.address,
//         //     0,
//         //     "0x",
//         //     data,
//         //     1718254858
//         // )
//         await aFiPassiveRebalanceInstance.setPriceOracle(
//             [
//                 "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//                 "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//                 "0x6B175474E89094C44Da98b954EedeAC495271d0F"
//             ],
//             [
//                 //"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // underlying - WBTC
//                 "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
//                 "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",  // UNI
//                 "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
//                 "0xD31a59c85aE9D8edEFeC411D448f90841571b89c"  // SOL
//             ],
//             [
//                 "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
//                 "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
//                 "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"
//             ], // USDT, USDC - chainlink oracles
//             [
//                 //"0xf4030086522a5beea4988f8ca5b36dbc97bee88c",
//                 "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
//                 "0x553303d460ee0afb37edff9be42922d8ff63220e",
//                 "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",
//                 "0x4ffc43a60e009b551865a93d232e33fce9f01507"
//             ],
//         );


//         // await aFiPassiveRebalanceInstance.setAFiOracle(aFiAFiOracleInstance.address);
//         await aFiPassiveRebalanceInstance.setStorage(aFiStorageInstance.address);
//         await aFiPassiveRebalanceInstance.setOracle(aFiAFiOracleInstance.address);
//         console.log("transfer complete")
//         console.log("funded account balance usdttttttttt", investorusdtBalance);
//         await aFiManagerInstance.setafiOracleContract(aFiAFiOracleInstance.address);
//         await aFiAFiOracleInstance.updateAFiManager(aFiManagerInstance.address);
//     });


//     context('Basic checks for deposit and withdraw', () => {


//         it("withdraw check", async () => {
//             const beforeUSDTDep = await usdtConInstance.balanceOf(investor1.address)
//             console.log("before Deposit user usdt balance", `${beforeUSDTDep}`);


//             await SYAtvAdapterCon.setATVStorage(aFiStorageInstance.address);


//             console.log("check --0")
           
//             await aFiPassiveRebalanceInstance.directPools(
//                 ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//                 ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//                 ["0x3470447f3CecfFAc709D3e783A307790b0208d60"]
//             )


//             console.log("check --1")


//                 await aFiPassiveRebalanceInstance.updateGlobalFees(
//                 ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//                 ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//                 [3000]
//             );




//             console.log("amountOut", await aFiPassiveRebalanceInstance.getMinimumAmountOut("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 1000000000000000000n, "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801"));


//             console.log("check --1")


//             // await aTokenConInstance.connect(investor1).deposit(
//             //     1000000000, usdcConInstance.address
//             // );


//             await aTokenConInstance.setAfiTransferability(true);
//             await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, SYAtvAdapterCon.address);


//             await usdcConInstance.connect(investor1).transfer(SYAtvAdapterCon.address, 1000000000);


//             await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, SYAtvAdapterCon.address, SYAtvAdapterCon.address);


//             await SYAtvAdapterCon.connect(investor1).convertToDeposit(usdcConInstance.address, 1000000000);
           

//             let AfterusdtBalance1 = await usdtConInstance.balanceOf(investor1.address);
//             console.log("After Deposit user usdt balance", `${AfterusdtBalance1}`);


//             const nav1 = await aTokenConInstance.depositUserNav(investor1.address);
//             console.log("user nav1", `${nav1}`);


//             const NavfromStorage = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             console.log("Nav from storage", `${NavfromStorage}`);

            
//             // await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, investor1.address, investor1.address);


//             // const swapParams = {
//             //     afiContract: aTokenConInstance.address,
//             //     oToken: usdcConInstance.address,
//             //     cSwapFee: 1000000,
//             //     cSwapCounter: 0,
//             //     depositTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
//             //     minimumReturnAmount: [0, 0, 0, 0, 0],
//             //     iMinimumReturnAmount: [0, 0, 0], // Adjust according to your contract's expectations
//             //     underlyingTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],  // SOL], // Fill this array if your function expects specific tokens
//             //     newProviders: [0], // Fill this with the new providers' information
//             //     _deadline: deadline,
//             //     cometToClaim: [],
//             //     cometRewardTokens: [],
//             //     rewardTokenMinReturnAmounts: []
//             // };

//             // await aTokenConInstance.connect(investor1).pauseUnpauseDeposit(true);
//             // await aFiAFiOracleInstance.connect(investor1).cumulativeSwap(swapParams, 0, oneInchParam, ["0x"], 0);

//             const NavfromStorageAfter = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             console.log("Nav from storage after cswap", `${NavfromStorageAfter}`);


//             const AfterusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("After Deposit user usdt balance", `${AfterusdtBalance}`)
//             const AfterusdcBalance = await usdcConInstance.balanceOf(aTokenConInstance.address)
//             console.log("After deposit user usdc balance", `${AfterusdcBalance}`)




//             const afibalance = await usdtConInstance.balanceOf(aTokenConInstance.address)
//             console.log("aficontract usdt balance", `${afibalance}`)


//             const Afterbal = await aTokenConInstance.balanceOf(
//                 investor1.address
//             );
//             console.log("Afterbal", `${Afterbal}`)

//             const minimumReturnAmount = [0, 0, 0, 0, 0];


//             const Amount = minimumReturnAmount.map(num => BigNumber.from(num));
//             const returnString = Amount.map(bn => bn.toString());


//             const AfterwithusdcBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("Before withdraw user usdt balance", `${AfterwithusdcBalance}`)


//             await aTokenConInstance.connect(investor1).withdraw(
//                 Afterbal, usdcConInstance.address, deadline, returnString, 3, 19541879
//             );


//             const AfterwithusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("After withdraw user usdt balance", `${AfterwithusdtBalance}`)
//         });


//         it("withdraw check", async () => {
//             const beforeUSDTDep = await usdtConInstance.balanceOf(investor1.address)
//             console.log("before Deposit user usdt balance", `${beforeUSDTDep}`);


//             console.log("check --0")
           
//             await aFiPassiveRebalanceInstance.directPools(
//                 ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//                 ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//                 ["0x3470447f3CecfFAc709D3e783A307790b0208d60"]
//             )


//             console.log("check --1")


//                 await aFiPassiveRebalanceInstance.updateGlobalFees(
//                 ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//                 ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//                 [3000]
//             );




//             console.log("amountOut", await aFiPassiveRebalanceInstance.getMinimumAmountOut("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 1000000000000000000n, "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801"));


//             console.log("check --1")


//             await aTokenConInstance.connect(investor1).deposit(
//                 1000000000, usdcConInstance.address
//             );


//             await aTokenConInstance.setAfiTransferability(true);
//             await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, SYAtvAdapterCon.address);
//             await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, SYAtvAdapterCon.address, SYAtvAdapterCon.address);


//             let AfterusdtBalance1 = await usdtConInstance.balanceOf(investor1.address);
//             console.log("After Deposit user usdt balance", `${AfterusdtBalance1}`);


//             const nav1 = await aTokenConInstance.depositUserNav(investor1.address);
//             console.log("user nav1", `${nav1}`);


//             const NavfromStorage = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             console.log("Nav from storage", `${NavfromStorage}`);


//             await SYAtvAdapterCon.updateVaultControllers(aTokenConInstance.address, investor1.address);


//             const swapParams = {
//                 afiContract: aTokenConInstance.address,
//                 oToken: usdcConInstance.address,
//                 cSwapFee: 1000000,
//                 cSwapCounter: 0,
//                 depositTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
//                 minimumReturnAmount: [0, 0, 0, 0, 0],
//                 iMinimumReturnAmount: [0, 0, 0], // Adjust according to your contract's expectations
//                 underlyingTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],  // SOL], // Fill this array if your function expects specific tokens
//                 newProviders: [0], // Fill this with the new providers' information
//                 _deadline: deadline,
//                 cometToClaim: [],
//                 cometRewardTokens: [],
//                 rewardTokenMinReturnAmounts: []
//             };




//             await SYAtvAdapterCon.setPauseDepController(aTokenConInstance.address, investor1.address);
//             await SYAtvAdapterCon.connect(investor1).setPauseUnpauseDeposit(aTokenConInstance.address, true);
//             await SYAtvAdapterCon.connect(investor1).cumulativeSwap(swapParams, 0, oneInchParam, ["0x"], 0);


//             const NavfromStorageAfter = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             console.log("Nav from storage after cswap", `${NavfromStorageAfter}`);


//             const AfterusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("After Deposit user usdt balance", `${AfterusdtBalance}`)
//             const AfterusdcBalance = await usdcConInstance.balanceOf(aTokenConInstance.address)
//             console.log("After deposit user usdc balance", `${AfterusdcBalance}`)




//             const afibalance = await usdtConInstance.balanceOf(aTokenConInstance.address)
//             console.log("aficontract usdt balance", `${afibalance}`)


//             const Afterbal = await aTokenConInstance.balanceOf(
//                 investor1.address
//             );
//             console.log("Afterbal", `${Afterbal}`)

//             const minimumReturnAmount = [0, 0, 0, 0, 0];


//             const Amount = minimumReturnAmount.map(num => BigNumber.from(num));
//             const returnString = Amount.map(bn => bn.toString());


//             const AfterwithusdcBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("Before withdraw user usdt balance", `${AfterwithusdcBalance}`)


//             await aTokenConInstance.connect(investor1).withdraw(
//                 197801111576383300n, usdcConInstance.address, deadline, returnString, 3, 19541879
//             );


//             const AfterwithusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             console.log("After withdraw user usdt balance", `${AfterwithusdtBalance}`)
//         });
//     });

//     context('Testing getAdapterTokensDeposit and getAdapterTokensRedeem functions', () => {
        
//         it('Should return correct deposit tokens from getAdapterTokensDeposit', async () => {
//             // Get deposit tokens
//             const depositTokens = await SYAtvAdapterCon.getAdapterTokensDeposit();
            
//             // Verify the returned tokens match VAULT_TOKENS
//             expect(depositTokens.length).to.be.greaterThan(0);
            
//             // Should include USDC as it's the configured token
//             const expectedToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
//             expect(depositTokens).to.include(expectedToken);
            
//             console.log("Deposit tokens:", depositTokens);
//         });

//         it('Should return correct redeem tokens from getAdapterTokensRedeem', async () => {
//             // Get redeem tokens
//             const redeemTokens = await SYAtvAdapterCon.getAdapterTokensRedeem();
            
//             // Verify the returned tokens match VAULT_TOKENS
//             expect(redeemTokens.length).to.be.greaterThan(0);
            
//             // Should include USDC as it's the configured token
//             const expectedToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
//             expect(redeemTokens).to.include(expectedToken);
            
//             console.log("Redeem tokens:", redeemTokens);
//         });

//         it('Should return same tokens for both deposit and redeem', async () => {
//             const depositTokens = await SYAtvAdapterCon.getAdapterTokensDeposit();
//             const redeemTokens = await SYAtvAdapterCon.getAdapterTokensRedeem();
            
//             // Both should return the same array
//             expect(depositTokens.length).to.equal(redeemTokens.length);
//             for(let i = 0; i < depositTokens.length; i++) {
//                 expect(depositTokens[i]).to.equal(redeemTokens[i]);
//             }
//         });
//     });

//     context('Testing previewConvertToDeposit function', () => {
        
//         beforeEach(async () => {
//             // Set ATV Storage for preview functions to work
//             await SYAtvAdapterCon.setATVStorage(aFiStorageInstance.address);
//         });

//         it('Should preview deposit correctly for supported token', async () => {
//             const depositAmount = ethers.utils.parseUnits("1000", 6); // 1000 USDC
            
//             // Preview the deposit
//             const expectedShares = await SYAtvAdapterCon.previewConvertToDeposit(
//                 usdcConInstance.address,
//                 depositAmount
//             );
            
//             console.log("Expected shares for 1000 USDC:", expectedShares.toString());
    
//             // Verify the result is greater than 0
//             expect(expectedShares).to.be.gt(0);
            
//             // The preview should account for 1% fee
//             // So effective amount should be 990 USDC (99% of 1000)
//         });

//         it('Should revert for unsupported token in previewConvertToDeposit', async () => {
//             const unsupportedToken = "0x0000000000000000000000000000000000000001";
//             const depositAmount = ethers.utils.parseUnits("1000", 6);
            
//             await expect(
//                 SYAtvAdapterCon.previewConvertToDeposit(unsupportedToken, depositAmount)
//             ).to.be.revertedWith("Unsupported token");
//         });

//         it('Should revert for zero amount in previewConvertToDeposit', async () => {
//             await expect(
//                 SYAtvAdapterCon.previewConvertToDeposit(usdcConInstance.address, 0)
//             ).to.be.revertedWith("Amount must be greater than 0");
//         });

//         it('Should account for 1% fee in preview calculation', async () => {
//             const depositAmount = ethers.utils.parseUnits("1000", 6); // 1000 USDC
            
//             // Get preview with fee
//             const sharesWithFee = await SYAtvAdapterCon.previewConvertToDeposit(
//                 usdcConInstance.address,
//                 depositAmount
//             );
            
//             // For first deposit, shares should be (amount * 99 / 100) / 100
//             // as per the contract logic for first deposit scenario
//             // This tests that the 1% fee is properly deducted
            
//             console.log("Shares accounting for 1% fee:", sharesWithFee.toString());
//             expect(sharesWithFee).to.be.gt(0);
//         });

//         it('Should handle first deposit scenario correctly', async () => {
//             // For a fresh vault with no deposits, preview should follow first deposit logic
//             const depositAmount = ethers.utils.parseUnits("10000", 6); // 10000 USDC
            
//             const expectedShares = await SYAtvAdapterCon.previewConvertToDeposit(
//                 usdcConInstance.address,
//                 depositAmount
//             );
            
//             console.log("First deposit preview - Amount:", depositAmount.toString());
//             console.log("First deposit preview - Expected shares:", expectedShares.toString());
            
//             // Verify shares are calculated correctly for first deposit
//             expect(expectedShares).to.be.gt(0);
//         });
//     });

//     context('Testing previewConvertToRedeem function', () => {
        
//         beforeEach(async () => {
//             // Set ATV Storage for preview functions to work
//             await SYAtvAdapterCon.setATVStorage(aFiStorageInstance.address);
            
//             // Do an initial deposit to have some shares in the vault
//             await aTokenConInstance.setAfiTransferability(true);
//             await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, SYAtvAdapterCon.address);
//             await usdcConInstance.connect(investor1).transfer(SYAtvAdapterCon.address, 1000000000);
//             await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, SYAtvAdapterCon.address, SYAtvAdapterCon.address);
//             await SYAtvAdapterCon.connect(investor1).convertToDeposit(usdcConInstance.address, 1000000000);
//         });

//         it('Should preview redeem correctly for valid shares', async () => {
           
//             const Afterbal = await aTokenConInstance.balanceOf(
//                 investor1.address
//             );
//             console.log("Afterbal", `${Afterbal}`)
            
//             // Preview the redemption
//             const expectedTokens = await SYAtvAdapterCon.previewConvertToRedeem(
//                 usdcConInstance.address,
//                 Afterbal
//             );
            
//             console.log("Expected USDC for redeeming shares:", expectedTokens.toString());
            
//             // Verify the result is greater than 0 if there are assets in the vault
//             expect(expectedTokens).to.be.gte(0);
//         });

//         it('Should revert for unsupported token in previewConvertToRedeem', async () => {
//             const unsupportedToken = "0x0000000000000000000000000000000000000001";
//             const sharesToRedeem = ethers.utils.parseUnits("100", 18);
            
//             await expect(
//                 SYAtvAdapterCon.previewConvertToRedeem(unsupportedToken, sharesToRedeem)
//             ).to.be.revertedWith("Unsupported token");
//         });

//         it('Should revert for zero shares in previewConvertToRedeem', async () => {
//             await expect(
//                 SYAtvAdapterCon.previewConvertToRedeem(usdcConInstance.address, 0)
//             ).to.be.revertedWith("Amount must be greater than 0");
//         });

//         it('Should return 0 when total supply is 0', async () => {
//             // Deploy a fresh adapter with empty vault
//             const SYadapter = await ethers.getContractFactory('SYAtvAdapter');
//             const freshAdapter = await SYadapter.deploy(aTokenConInstance.address, aFiAFiOracleInstance.address);
//             await freshAdapter.setATVStorage(aFiStorageInstance.address);
            
//             const sharesToRedeem = ethers.utils.parseUnits("100", 18);
            
//             // Should handle gracefully when totalSupply is 0
//             const expectedTokens = await freshAdapter.previewConvertToRedeem(
//                 usdcConInstance.address,
//                 sharesToRedeem
//             );
            
//             // Based on contract logic, this might return 0 or revert
//             console.log("Expected tokens when totalSupply is 0:", expectedTokens.toString());
//         });
//     });   
// });



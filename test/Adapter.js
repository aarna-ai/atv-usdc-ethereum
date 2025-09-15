// const { ethers } = require('hardhat');
// const { expect } = require('chai');
// const { BigNumber } = require('ethers');
// const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


// describe("WrappedBoosterTL", () => {

//   let rewardToken;
//   let timelock;
//   let owner, account1, account2, account3, account4, account5;
//   let afiBase;
//   let newAfiBase;
//   let afiStorage;
//   let platformWallet;
//   let attacker;
//   const zero_address = "0x0000000000000000000000000000000000000000";

//   beforeEach(async () => {

//     const currentTime = await time.latest();
//     deadline = currentTime + (60 * 60);

//     // Contracts are deployed using the first signer/account by default
//     [owner, account1, account2, account3, account4, account5, platformWallet, attacker] = await ethers.getSigners();

//     const RewardToken = await ethers.getContractFactory("TestToken");
//     rewardToken = await RewardToken.deploy(owner);

//     const UsdcToken = await ethers.getContractFactory("TestToken");
//     usdcTokenInstane = await UsdcToken.deploy(owner);

//     console.log("address of RewardToken = ", rewardToken.target);


//     const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//     afiBase = await AfiBase.deploy(owner);

//     const AtvOracle = await ethers.getContractFactory("AFiOracleMock");
//     atvOracleInstance = await AtvOracle.deploy(owner);

//     // const NEWAfiBase = await ethers.getContractFactory("AFiBaseMock");
//     // newAfiBase = await NEWAfiBase.deploy(owner);

    
//     console.log("atvOracleInstance", atvOracleInstance.target);
    
//     console.log("address of ATvBase = ", afiBase.target);
    
    
//     const AfiStorage = await ethers.getContractFactory("StorageMock");
//     afiStorage = await AfiStorage.deploy();
//     // await afiBase.deployed();
//     console.log("afiStorage.target", afiStorage.target);
//     console.log("(usdcTokenInstane.address", (usdcTokenInstane.target));

//     //await afiStorage.updateTVL(afiBase.target, ethers.parseEther("1000"));
//     await usdcTokenInstane.mint(account1.address, ethers.parseEther("10"));

//     const Timelock = await ethers.getContractFactory("AtvWrappedBoosterTL");

//     await afiStorage.updateTVL(afiBase.target, 100000000000000000000000n);
//     console.log("afiStorage", await afiStorage.calculatePoolInUsd(afiBase.target));
//     await afiBase.mint(account1.address, 1000000000000000000000n);

//     timelock = await Timelock.deploy(usdcTokenInstane.target, afiBase.target, afiStorage.target, atvOracleInstance.target);

//     //await expect(Timelock.deploy(zero_address, afiStorage.target)).to.be.reverted;

//     console.log("afiBase", afiBase.target)
//     console.log("afiStorage", afiStorage.target)

//     await afiBase.setAFiStorage(afiStorage.target);

//     let allowance = await afiBase.allowance(account1.address, timelock.target);
//     console.log("allowance", allowance);

//     await usdcTokenInstane.connect(account1).approve(timelock.target, 10000000000000000000000000000n);
//     // await afiBase.connect(account2).approve(timelock.target, 1000000000000000000000n);
//     // await afiBase.connect(account4).approve(timelock.target, 1000000000000000000n);
//     // await newAfiBase.connect(account1).approve(timelock.target, 10000000000000000000000000000n);


//     allowance = await afiBase.allowance(account1.address, timelock.target);
//     console.log("allowance", allowance);
//   });


//   describe("Deposit", () => {
//     beforeEach(async () => {
//       // await timelock.updatePlatformFee(200); // 2% fee (maximum allowed)
//       // await timelock.updatePlatformWallet(platformWallet.address);
      
//       await afiStorage.updateTVL(afiBase.target, ethers.parseEther("1000"));
//       await afiBase.mint(account1.address, ethers.parseEther("10"));
      
//     });
//     it('Basic checks for deposit and withdraw', async() => {
//             const beforeUSDTDep = await usdcTokenInstane.balanceOf(account1.address)
//             console.log("before Deposit user usdt balance", `${beforeUSDTDep}`);

//             await timelock.connect(account1).deposit(1000000000, account1.address);
           

//             let AfterusdtBalance1 = await usdcTokenInstane.balanceOf(account1.address);
//             console.log("After Deposit user usdt balance", `${AfterusdtBalance1}`);


//             // const nav1 = await aTokenConInstance.depositUserNav(investor1.address);
//             // console.log("user nav1", `${nav1}`);


//             // const NavfromStorage = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             // console.log("Nav from storage", `${NavfromStorage}`);

        

//             // const NavfromStorageAfter = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//             // console.log("Nav from storage after cswap", `${NavfromStorageAfter}`);


//             // const AfterusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             // console.log("After Deposit user usdt balance", `${AfterusdtBalance}`)
//             // const AfterusdcBalance = await usdcConInstance.balanceOf(aTokenConInstance.address)
//             // console.log("After deposit user usdc balance", `${AfterusdcBalance}`)



//             // const afibalance = await usdtConInstance.balanceOf(aTokenConInstance.address)
//             // console.log("aficontract usdt balance", `${afibalance}`)


//             // const Afterbal = await aTokenConInstance.balanceOf(
//             //     investor1.address
//             // );
//             // console.log("Afterbal", `${Afterbal}`)

//             // const minimumReturnAmount = [0, 0, 0, 0, 0];


//             // const Amount = minimumReturnAmount.map(num => BigNumber.from(num));
//             // const returnString = Amount.map(bn => bn.toString());


//             // const AfterwithusdcBalance = await usdtConInstance.balanceOf(investor1.address)
//             // console.log("Before withdraw user usdt balance", `${AfterwithusdcBalance}`)


//             // await aTokenConInstance.connect(investor1).withdraw(
//             //     Afterbal, usdcConInstance.address, deadline, returnString, 3, 19541879
//             // );


//             // const AfterwithusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//             // console.log("After withdraw user usdt balance", `${AfterwithusdtBalance}`)
//         });

  
//     //     it("withdraw check", async () => {
//     //         const beforeUSDTDep = await usdtConInstance.balanceOf(investor1.address)
//     //         console.log("before Deposit user usdt balance", `${beforeUSDTDep}`);


//     //         console.log("check --0")
           
//     //         await aFiPassiveRebalanceInstance.directPools(
//     //             ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//     //             ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//     //             ["0x3470447f3CecfFAc709D3e783A307790b0208d60"]
//     //         )


//     //         console.log("check --1")


//     //             await aFiPassiveRebalanceInstance.updateGlobalFees(
//     //             ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"],
//     //             ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
//     //             [3000]
//     //         );




//     //         console.log("amountOut", await aFiPassiveRebalanceInstance.getMinimumAmountOut("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 1000000000000000000n, "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801"));


//     //         console.log("check --1")


//     //         await aTokenConInstance.connect(investor1).deposit(
//     //             1000000000, usdcConInstance.address
//     //         );


//     //         await aTokenConInstance.setAfiTransferability(true);
//     //         await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, SYAtvAdapterCon.address);
//     //         await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, SYAtvAdapterCon.address, SYAtvAdapterCon.address);


//     //         let AfterusdtBalance1 = await usdtConInstance.balanceOf(investor1.address);
//     //         console.log("After Deposit user usdt balance", `${AfterusdtBalance1}`);


//     //         const nav1 = await aTokenConInstance.depositUserNav(investor1.address);
//     //         console.log("user nav1", `${nav1}`);


//     //         const NavfromStorage = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//     //         console.log("Nav from storage", `${NavfromStorage}`);


//     //         await SYAtvAdapterCon.updateVaultControllers(aTokenConInstance.address, investor1.address);


//     //         const swapParams = {
//     //             afiContract: aTokenConInstance.address,
//     //             oToken: usdcConInstance.address,
//     //             cSwapFee: 1000000,
//     //             cSwapCounter: 0,
//     //             depositTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
//     //             minimumReturnAmount: [0, 0, 0, 0, 0],
//     //             iMinimumReturnAmount: [0, 0, 0], // Adjust according to your contract's expectations
//     //             underlyingTokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],  // SOL], // Fill this array if your function expects specific tokens
//     //             newProviders: [0], // Fill this with the new providers' information
//     //             _deadline: deadline,
//     //             cometToClaim: [],
//     //             cometRewardTokens: [],
//     //             rewardTokenMinReturnAmounts: []
//     //         };




//     //         await SYAtvAdapterCon.setPauseDepController(aTokenConInstance.address, investor1.address);
//     //         await SYAtvAdapterCon.connect(investor1).setPauseUnpauseDeposit(aTokenConInstance.address, true);
//     //         await SYAtvAdapterCon.connect(investor1).cumulativeSwap(swapParams, 0, oneInchParam, ["0x"], 0);


//     //         const NavfromStorageAfter = await aFiFactoryInstance.getPricePerFullShare(aTokenConInstance.address, aFiStorageInstance.address);
//     //         console.log("Nav from storage after cswap", `${NavfromStorageAfter}`);


//     //         const AfterusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//     //         console.log("After Deposit user usdt balance", `${AfterusdtBalance}`)
//     //         const AfterusdcBalance = await usdcConInstance.balanceOf(aTokenConInstance.address)
//     //         console.log("After deposit user usdc balance", `${AfterusdcBalance}`)




//     //         const afibalance = await usdtConInstance.balanceOf(aTokenConInstance.address)
//     //         console.log("aficontract usdt balance", `${afibalance}`)


//     //         const Afterbal = await aTokenConInstance.balanceOf(
//     //             investor1.address
//     //         );
//     //         console.log("Afterbal", `${Afterbal}`)








//     //         const minimumReturnAmount = [0, 0, 0, 0, 0];


//     //         const Amount = minimumReturnAmount.map(num => BigNumber.from(num));
//     //         const returnString = Amount.map(bn => bn.toString());


//     //         const AfterwithusdcBalance = await usdtConInstance.balanceOf(investor1.address)
//     //         console.log("Before withdraw user usdt balance", `${AfterwithusdcBalance}`)


//     //         await aTokenConInstance.connect(investor1).withdraw(
//     //             197801111576383300n, usdcConInstance.address, deadline, returnString, 3, 19541879
//     //         );


//     //         const AfterwithusdtBalance = await usdtConInstance.balanceOf(investor1.address)
//     //         console.log("After withdraw user usdt balance", `${AfterwithusdtBalance}`)
//     //     });
//     // });

//     // context('Testing getAdapterTokensDeposit and getAdapterTokensRedeem functions', () => {
        
//     //     it('Should return correct deposit tokens from getAdapterTokensDeposit', async () => {
//     //         // Get deposit tokens
//     //         const depositTokens = await SYAtvAdapterCon.getAdapterTokensDeposit();
            
//     //         // Verify the returned tokens match VAULT_TOKENS
//     //         expect(depositTokens.length).to.be.greaterThan(0);
            
//     //         // Should include USDC as it's the configured token
//     //         const expectedToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
//     //         expect(depositTokens).to.include(expectedToken);
            
//     //         console.log("Deposit tokens:", depositTokens);
//     //     });

//     //     it('Should return correct redeem tokens from getAdapterTokensRedeem', async () => {
//     //         // Get redeem tokens
//     //         const redeemTokens = await SYAtvAdapterCon.getAdapterTokensRedeem();
            
//     //         // Verify the returned tokens match VAULT_TOKENS
//     //         expect(redeemTokens.length).to.be.greaterThan(0);
            
//     //         // Should include USDC as it's the configured token
//     //         const expectedToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
//     //         expect(redeemTokens).to.include(expectedToken);
            
//     //         console.log("Redeem tokens:", redeemTokens);
//     //     });

//     //     it('Should return same tokens for both deposit and redeem', async () => {
//     //         const depositTokens = await SYAtvAdapterCon.getAdapterTokensDeposit();
//     //         const redeemTokens = await SYAtvAdapterCon.getAdapterTokensRedeem();
            
//     //         // Both should return the same array
//     //         expect(depositTokens.length).to.equal(redeemTokens.length);
//     //         for(let i = 0; i < depositTokens.length; i++) {
//     //             expect(depositTokens[i]).to.equal(redeemTokens[i]);
//     //         }
//     //     });
//     // });

//     // context('Testing previewConvertToDeposit function', () => {
        
//     //     beforeEach(async () => {
//     //         // Set ATV Storage for preview functions to work
//     //         await SYAtvAdapterCon.setATVStorage(aFiStorageInstance.address);
//     //     });

//     //     it('Should preview deposit correctly for supported token', async () => {
//     //         const depositAmount = ethers.utils.parseUnits("1000", 6); // 1000 USDC
            
//     //         // Preview the deposit
//     //         const expectedShares = await SYAtvAdapterCon.previewConvertToDeposit(
//     //             usdcConInstance.address,
//     //             depositAmount
//     //         );
            
//     //         console.log("Expected shares for 1000 USDC:", expectedShares.toString());
    
//     //         // Verify the result is greater than 0
//     //         expect(expectedShares).to.be.gt(0);
            
//     //         // The preview should account for 1% fee
//     //         // So effective amount should be 990 USDC (99% of 1000)
//     //     });

//     //     // it('Should revert for unsupported token in previewConvertToDeposit', async () => {
//     //     //     const unsupportedToken = "0x0000000000000000000000000000000000000001";
//     //     //     const depositAmount = ethers.utils.parseUnits("1000", 6);
            
//     //     //     await expect(
//     //     //         SYAtvAdapterCon.previewConvertToDeposit(unsupportedToken, depositAmount)
//     //     //     ).to.be.revertedWith("Unsupported token");
//     //     // });

//     //     // it('Should revert for zero amount in previewConvertToDeposit', async () => {
//     //     //     await expect(
//     //     //         SYAtvAdapterCon.previewConvertToDeposit(usdcConInstance.address, 0)
//     //     //     ).to.be.revertedWith("Amount must be greater than 0");
//     //     // });

//     //     // it('Should account for 1% fee in preview calculation', async () => {
//     //     //     const depositAmount = ethers.utils.parseUnits("1000", 6); // 1000 USDC
            
//     //     //     // Get preview with fee
//     //     //     const sharesWithFee = await SYAtvAdapterCon.previewConvertToDeposit(
//     //     //         usdcConInstance.address,
//     //     //         depositAmount
//     //     //     );
            
//     //     //     // For first deposit, shares should be (amount * 99 / 100) / 100
//     //     //     // as per the contract logic for first deposit scenario
//     //     //     // This tests that the 1% fee is properly deducted
            
//     //     //     console.log("Shares accounting for 1% fee:", sharesWithFee.toString());
//     //     //     expect(sharesWithFee).to.be.gt(0);
//     //     // });

//     //     // it('Should handle first deposit scenario correctly', async () => {
//     //     //     // For a fresh vault with no deposits, preview should follow first deposit logic
//     //     //     const depositAmount = ethers.utils.parseUnits("10000", 6); // 10000 USDC
            
//     //     //     const expectedShares = await SYAtvAdapterCon.previewConvertToDeposit(
//     //     //         usdcConInstance.address,
//     //     //         depositAmount
//     //     //     );
            
//     //     //     console.log("First deposit preview - Amount:", depositAmount.toString());
//     //     //     console.log("First deposit preview - Expected shares:", expectedShares.toString());
            
//     //     //     // Verify shares are calculated correctly for first deposit
//     //     //     expect(expectedShares).to.be.gt(0);
//     //     // });
//     // });

//     // context('Testing previewConvertToRedeem function', () => {
        
//     //     beforeEach(async () => {
//     //         // Set ATV Storage for preview functions to work
//     //         await SYAtvAdapterCon.setATVStorage(aFiStorageInstance.address);
            
//     //         // Do an initial deposit to have some shares in the vault
//     //         await aTokenConInstance.setAfiTransferability(true);
//     //         await aFiPassiveRebalanceInstance.setPauseDepositController(aTokenConInstance.address, SYAtvAdapterCon.address);
//     //         await usdcConInstance.connect(investor1).transfer(SYAtvAdapterCon.address, 1000000000);
//     //         await aFiAFiOracleInstance.updateVaultControllers(aTokenConInstance.address, SYAtvAdapterCon.address, SYAtvAdapterCon.address);
//     //         await SYAtvAdapterCon.connect(investor1).convertToDeposit(usdcConInstance.address, 1000000000);
//     //     });

//     //     it('Should preview redeem correctly for valid shares', async () => {
           
//     //         const Afterbal = await aTokenConInstance.balanceOf(
//     //             investor1.address
//     //         );
//     //         console.log("Afterbal", `${Afterbal}`)
            
//     //         // Preview the redemption
//     //         const expectedTokens = await SYAtvAdapterCon.previewConvertToRedeem(
//     //             usdcConInstance.address,
//     //             Afterbal
//     //         );
            
//     //         console.log("Expected USDC for redeeming shares:", expectedTokens.toString());
            
//     //         // Verify the result is greater than 0 if there are assets in the vault
//     //         expect(expectedTokens).to.be.gte(0);
//     //     });

//     //     // it('Should revert for unsupported token in previewConvertToRedeem', async () => {
//     //     //     const unsupportedToken = "0x0000000000000000000000000000000000000001";
//     //     //     const sharesToRedeem = ethers.utils.parseUnits("100", 18);
            
//     //     //     await expect(
//     //     //         SYAtvAdapterCon.previewConvertToRedeem(unsupportedToken, sharesToRedeem)
//     //     //     ).to.be.revertedWith("Unsupported token");
//     //     // });

//     //     // it('Should revert for zero shares in previewConvertToRedeem', async () => {
//     //     //     await expect(
//     //     //         SYAtvAdapterCon.previewConvertToRedeem(usdcConInstance.address, 0)
//     //     //     ).to.be.revertedWith("Amount must be greater than 0");
//     //     // });

//     //     // it('Should return 0 when total supply is 0', async () => {
//     //     //     // Deploy a fresh adapter with empty vault
//     //     //     const SYadapter = await ethers.getContractFactory('SYAtvAdapter');
//     //     //     const freshAdapter = await SYadapter.deploy(aTokenConInstance.address, aFiAFiOracleInstance.address);
//     //     //     await freshAdapter.setATVStorage(aFiStorageInstance.address);
            
//     //     //     const sharesToRedeem = ethers.utils.parseUnits("100", 18);
            
//     //     //     // Should handle gracefully when totalSupply is 0
//     //     //     const expectedTokens = await freshAdapter.previewConvertToRedeem(
//     //     //         usdcConInstance.address,
//     //     //         sharesToRedeem
//     //     //     );
            
//     //     //     // Based on contract logic, this might return 0 or revert
//     //     //     console.log("Expected tokens when totalSupply is 0:", expectedTokens.toString());
//     //     // });
//     // });   
// });


// })


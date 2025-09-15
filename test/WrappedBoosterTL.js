const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
describe("AtvWrappedBoosterTL - Preview and Conversion Functions Tests", () => {
  let rewardToken, afiBase, afiStorage, timelock, oracleCon;
  let owner, user1, user2, user3, controller, platformWallet;

  beforeEach(async () => {
    [owner, user1, user2, user3, controller, platformWallet] = await ethers.getSigners();
    
    // Deploy token (USDC)
    const RewardToken = await ethers.getContractFactory("TestToken");
    rewardToken = await RewardToken.deploy(owner);

    // Mint USDC to users
    await rewardToken.mint(user1.address, ethers.parseUnits("10000", 6));
    await rewardToken.mint(user2.address, ethers.parseUnits("10000", 6));
    await rewardToken.mint(user3.address, ethers.parseUnits("10000", 6));

    // Deploy ATV vault mock
    const AFiBase = await ethers.getContractFactory("AFiBaseMock");
    afiBase = await AFiBase.deploy(owner, rewardToken.target);

    // Deploy storage mock
    const AfiStorage = await ethers.getContractFactory("StorageMock");
    afiStorage = await AfiStorage.deploy();

    // Deploy oracle mock
    const Oracle = await ethers.getContractFactory("AFiOracleMock");
    oracleCon = await Oracle.deploy(owner);

    // Setup ATV vault
    await afiBase.setAFiStorage(afiStorage.target);
    await afiStorage.updateTVL(afiBase.target, ethers.parseEther("1000"));
    await afiBase.mint(user1.address, ethers.parseEther("10"));

    // Deploy wrapper contract
    const Timelock = await ethers.getContractFactory("AtvWrappedBoosterTL");
    timelock = await Timelock.deploy(rewardToken.target, afiBase.target, afiStorage.target, oracleCon.target);

    // Setup controller and platform fee (1%)
    await timelock.setController(controller.address);
    await timelock.updatePlatformWalletAndFee(platformWallet.address, 100); // 1% = 100 basis points

    // Approve USDC spending
    await rewardToken.connect(user1).approve(timelock.target, ethers.MaxUint256);
    await rewardToken.connect(user2).approve(timelock.target, ethers.MaxUint256);
    await rewardToken.connect(user3).approve(timelock.target, ethers.MaxUint256);

    // Approve ATV vault token spending for exchange function
    await afiBase.connect(user1).approve(timelock.target, ethers.MaxUint256);
    await afiBase.connect(user2).approve(timelock.target, ethers.MaxUint256);
  });

  describe("Preview Functions with 1% Platform Fee", () => {
    // it("Should correctly preview deposit with 1% fee deduction", async () => {
    //   const depositAmount = ethers.parseUnits("1000", 6); // 1000 USDC
      
    //   const previewShares = await timelock.previewDeposit(depositAmount);
    //   console.log("Preview Deposit - Amount:", ethers.formatUnits(depositAmount, 6), "USDC");
    //   console.log("Preview Deposit - Expected Shares:", ethers.formatEther(previewShares));
      
    //   // Verify that fee is deducted (should receive shares for 990 USDC worth)
    //   const expectedAfterFee = depositAmount - (depositAmount / 100n); // 1% fee
    //   const manualCalc = await timelock.convertToShares(expectedAfterFee);
      
    //   expect(previewShares).to.be.approximately(manualCalc, ethers.parseEther("0.001"));
    //   expect(previewShares).to.be.gt(0);
    // });

    // it("Should correctly preview mint with 1% fee included", async () => {
    //   const sharesToMint = ethers.parseEther("100"); // 100 shares
      
    //   const previewAssets = await timelock.previewMint(sharesToMint);
    //   console.log("Preview Mint - Shares:", ethers.formatEther(sharesToMint));
    //   console.log("Preview Mint - Required Assets:", ethers.formatUnits(previewAssets, 6), "USDC");
      
    //   // Should require more assets due to 1% fee
    //   const baseAssets = await timelock.convertToAssets(sharesToMint);
    //   const expectedWithFee = (baseAssets * 100n) / 99n; // Add 1% fee
      
    //   expect(previewAssets).to.be.approximately(expectedWithFee, ethers.parseUnits("0.1", 6));
    //   expect(previewAssets).to.be.gt(baseAssets);
    // });

    it("Should correctly preview withdraw with 1% platform fee", async () => {
      const withdrawAmount = ethers.parseUnits("500", 6); // 500 USDC
      
      const previewShares = await timelock.previewWithdraw(withdrawAmount);
      console.log("Preview Withdraw - Amount:", ethers.formatUnits(withdrawAmount, 6), "USDC");
      console.log("Preview Withdraw - Required Shares:", ethers.formatEther(previewShares));
      
      // Should require more shares due to platform fee
      const baseShares = await timelock.convertToShares(withdrawAmount);
      expect(previewShares).to.be.gt(baseShares);
      expect(previewShares).to.be.gt(0);
    });

    it("Should correctly preview redeem with 1% platform fee deduction", async () => {
      const sharesToRedeem = ethers.parseEther("50"); // 50 shares
      
      const previewAssets = await timelock.previewRedeem(sharesToRedeem);
      console.log("Preview Redeem - Shares:", ethers.formatEther(sharesToRedeem));
      console.log("Preview Redeem - Expected Assets:", ethers.formatUnits(previewAssets, 6), "USDC");
      
      // Should receive less assets due to 1% platform fee
      const baseAssets = await timelock.convertToAssets(sharesToRedeem);
      const expectedAfterFee = (baseAssets * 99n) / 100n; // 1% fee deduction
      
      expect(previewAssets).to.be.approximately(expectedAfterFee, ethers.parseUnits("0.1", 6));
      expect(previewAssets).to.be.lt(baseAssets);
    });
  });

  describe("Conversion Functions", () => {
    it("Should correctly convert assets to shares", async () => {
      const assetAmount = ethers.parseUnits("1000", 6); // 1000 USDC
      
      const shares = await timelock.convertToShares(assetAmount);
      console.log("Convert To Shares - Assets:", ethers.formatUnits(assetAmount, 6), "USDC");
      console.log("Convert To Shares - Shares:", ethers.formatEther(shares));
      
      expect(shares).to.be.gt(0);
      
      // Verify round trip conversion (with some tolerance for fees and rounding)
      const backToAssets = await timelock.convertToAssets(shares);
      expect(backToAssets).to.be.approximately(assetAmount, ethers.parseUnits("1", 6));
    });

    it("Should correctly convert shares to assets", async () => {
      const shareAmount = ethers.parseEther("100"); // 100 shares
      
      const assets = await timelock.convertToAssets(shareAmount);
      console.log("Convert To Assets - Shares:", ethers.formatEther(shareAmount));
      console.log("Convert To Assets - Assets:", ethers.formatUnits(assets, 6), "USDC");
      
      expect(assets).to.be.gt(0);
      
      // Verify round trip conversion
      const backToShares = await timelock.convertToShares(assets);
      expect(backToShares).to.be.approximately(shareAmount, ethers.parseEther("0.1"));
    });
  });

  describe("Edge Cases and Fee Calculations", () => {
    it("Should handle small amounts correctly", async () => {
      const smallAmount = ethers.parseUnits("1", 6); // 1 USDC
      
      const previewShares = await timelock.previewDeposit(smallAmount);
      const shares = await timelock.convertToShares(smallAmount);
      const assets = await timelock.convertToAssets(previewShares);
      
      console.log("Small Amount Tests:");
      console.log("Amount:", ethers.formatUnits(smallAmount, 6), "USDC");
      console.log("Preview Shares:", ethers.formatEther(previewShares));
      console.log("Convert Shares:", ethers.formatEther(shares));
      console.log("Back to Assets:", ethers.formatUnits(assets, 6), "USDC");
      
      expect(previewShares).to.be.gt(0);
      expect(shares).to.be.gt(0);
      expect(assets).to.be.gt(0);
    });

    it("Should handle large amounts correctly", async () => {
      const largeAmount = ethers.parseUnits("10000", 6); // 10,000 USDC
      
      // Mint more tokens for this test
      await rewardToken.mint(user1.address, largeAmount);
      
      const previewShares = await timelock.previewDeposit(largeAmount);
      const shares = await timelock.convertToShares(largeAmount);
      
      console.log("Large Amount Tests:");
      console.log("Amount:", ethers.formatUnits(largeAmount, 6), "USDC");
      console.log("Preview Shares:", ethers.formatEther(previewShares));
      console.log("Convert Shares:", ethers.formatEther(shares));
      
      expect(previewShares).to.be.gt(0);
      expect(shares).to.be.gt(0);
    });

    it("Should correctly calculate fees at different platform fee rates", async () => {
      const testAmount = ethers.parseUnits("1000", 6);
      
      // Test with 1% fee (100 basis points)
      await timelock.updatePlatformWalletAndFee(platformWallet.address, 100);
      const preview1Percent = await timelock.previewWithdraw(testAmount);
      
      // Test with 2% fee (200 basis points)
      await timelock.updatePlatformWalletAndFee(platformWallet.address, 200);
      const preview2Percent = await timelock.previewWithdraw(testAmount);
      
      console.log("Fee Rate Comparison:");
      console.log("1% Fee - Required Shares:", ethers.formatEther(preview1Percent));
      console.log("2% Fee - Required Shares:", ethers.formatEther(preview2Percent));
      
      // Higher fee should require more shares
      expect(preview2Percent).to.be.gt(preview1Percent);
      
      // Reset to 1% for other tests
      await timelock.updatePlatformWalletAndFee(platformWallet.address, 100);
    });

    it("Should handle zero amounts gracefully", async () => {
      const zeroAmount = 0n;
      
      const previewShares = await timelock.previewDeposit(zeroAmount);
      const shares = await timelock.convertToShares(zeroAmount);
      const assets = await timelock.convertToAssets(zeroAmount);
      
      expect(previewShares).to.equal(0);
      expect(shares).to.equal(0);
      expect(assets).to.equal(0);
    });
  });

  describe("NAV Impact on Conversions", () => {
    it("Should reflect NAV changes in conversion rates", async () => {
      const testAmount = ethers.parseUnits("1000", 6);
      
      // Get initial conversion rate
      const initialShares = await timelock.convertToShares(testAmount);
      console.log("Initial NAV - Shares for 1000 USDC:", ethers.formatEther(initialShares));
      
      // Increase NAV by increasing TVL
      await afiStorage.updateTVL(afiBase.target, ethers.parseEther("2000")); // Double the TVL
      
      // Get conversion rate after NAV increase
      const sharesAfterNAVIncrease = await timelock.convertToShares(testAmount);
      console.log("After NAV increase - Shares for 1000 USDC:", ethers.formatEther(sharesAfterNAVIncrease));
      
      // Should get fewer shares for same amount when NAV increases
      expect(sharesAfterNAVIncrease).to.be.lt(initialShares);
      
      // Verify the reverse conversion
      const assetsFromShares = await timelock.convertToAssets(initialShares);
      console.log("Assets from initial shares after NAV increase:", ethers.formatUnits(assetsFromShares, 6), "USDC");
      
      // Should get more assets for same shares when NAV increases
      expect(assetsFromShares).to.be.gt(testAmount);
    });
  });
});
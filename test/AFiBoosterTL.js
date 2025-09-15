// const { ethers } = require('hardhat');
// const { expect } = require('chai');
// const { BigNumber } = require('ethers');
// const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


// describe("AFiBoosterTL", () => {

//   let rewardToken;
//   let timelock;
//   let owner, account1, account2;
//   let afiBase;
//   let afiStorage;

//   const zero_address = "0x0000000000000000000000000000000000000000";

//   beforeEach(async () => {

//     const currentTime = await time.latest();
//     deadline = currentTime + (60 * 60);

//     // Contracts are deployed using the first signer/account by default
//     [owner, account1, account2] = await ethers.getSigners();

//     const RewardToken = await ethers.getContractFactory("TestToken");
//     rewardToken = await RewardToken.deploy(owner);

//     const Timelock = await ethers.getContractFactory("AFiBoosterTL");
//     timelock = await Timelock.deploy(rewardToken.target);

//     await expect(Timelock.deploy(zero_address)).to.be.revertedWith('Booster TL: Please enter a valid address');

//   });

//   describe('Add AFi Token', async () => {

//     it("Should add AFi token", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       const isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);
//     });

//     it("Should add multiple AFi tokens", async () => {
//       var isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);

//       await timelock.addAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       isAFi = await timelock.isAFiToken(account1.address);

//       expect(isAFi).to.equal(false);

//       await timelock.addAFiToken(account1.address);

//       isAFi = await timelock.isAFiToken(account1.address);

//       expect(isAFi).to.equal(true);
//     });

//     it("Should not add AFi token if address is 0 address", async () => {
//       await expect(timelock.addAFiToken(zero_address)).to.be.revertedWith('Booster TL: Please enter a valid address');
//     });

//     it("Should not add AFi token if already added", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       const isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       await expect(timelock.addAFiToken(rewardToken.target)).to.be.revertedWith('Booster TL: Already added');
//     });

//     it("Should not add AFi token if not added by the owner", async () => {
//       await expect(timelock.connect(account1).addAFiToken(account2)).to.be.
//         reverted;
//     });

//   });

//   describe('Remove AFi Token', async () => {

//     it("Should remove AFi token", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       var isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       await timelock.removeAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);
//     });

//     it("Should remove multiple AFi tokens", async () => {
//       var isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);

//       await timelock.addAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       isAFi = await timelock.isAFiToken(account1.address);

//       expect(isAFi).to.equal(false);

//       await timelock.addAFiToken(account1.address);

//       isAFi = await timelock.isAFiToken(account1.address);

//       expect(isAFi).to.equal(true);

//       await timelock.removeAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);

//       await timelock.removeAFiToken(account1.address);

//       isAFi = await timelock.isAFiToken(account1.address);

//       expect(isAFi).to.equal(false);
//     });

//     it("Should not remove AFi token if address is 0 address", async () => {
//       await expect(timelock.removeAFiToken(zero_address)).to.be.
//         revertedWith('Booster TL: Please enter a valid address');
//     });

//     it("Should not remove AFi token if already removed", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       var isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       await timelock.removeAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);            

//       await expect(timelock.removeAFiToken(rewardToken.target)).to.be.revertedWith('Booster TL: Not added yet');
//     });

//     it("Should not remove AFi token if not removed by the owner", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       await expect(timelock.connect(account1).removeAFiToken(rewardToken.target)).to.be.
//         reverted;
//     });

//   });

//   describe('Stake', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);


//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(owner.address, 7500000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should stake", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 30);
//       await timelock.connect(account1).stake((1), afiBase.target);

//       const stakingDetails = await timelock.stakingDetails(account1.address,0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);

//       expect((stakingDetails[0])).to.equal((1));
//       expect(stakingDetails[2]).to.equal(afiBase.target);
//       expect(stakingDetails[8]).to.equal(false);
//     });

//     it("Should be able to stake multiple time", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake((1), afiBase.target);
      
//       await time.increase(30);
      
//       await timelock.connect(account1).stake((3), afiBase.target);

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - start time", `${stakingDetails[1]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[2]}`);
//       console.log("stakingDetails - nav of the user", `${stakingDetails[3]}`);

//       expect(stakingDetails[0]).to.equal((1));
//       expect(stakingDetails[2]).to.equal(afiBase.target);
//       expect(stakingDetails[8]).to.equal(false);

//       stakingDetails = await timelock.stakingDetails(account1.address, 1);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - start time", `${stakingDetails[1]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[2]}`);
//       console.log("stakingDetails - nav of the user", `${stakingDetails[3]}`);

//       expect(stakingDetails[0]).to.equal((3));
//       expect(stakingDetails[2]).to.equal(afiBase.target);
//       expect(stakingDetails[8]).to.equal(false);

//     });

//     it("Should revert when trying to stake non afi-token", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await expect(timelock.connect(account1).stake(1, account2)).to.be.
//         revertedWith('Booster TL: This token is not stakable');
//     });

//     it("Should revert when trying stake zero amount", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 30);

//       await expect(timelock.connect(account1).stake(0, afiBase.target)).to.be.
//         revertedWith('Booster TL: Amount must be greater than 0');
//     });

//     it("Should revert when paused", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake(90, afiBase.target)
      
//       const rewards =  (await timelock.totalRewardsDistributed());
//       console.log("stakingDetails - amount staked", `${rewards}`);
      
//       await timelock.pause();
//       await expect(timelock.connect(account1).stake(1, afiBase.target)).to.be.
//         revertedWithCustomError(timelock,'EnforcedPause');
//     });

//     it("Should revert when AFi token is frozen", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake(90, afiBase.target)
      
//       const rewards =  (await timelock.totalRewardsDistributed());
//       console.log("stakingDetails - amount staked", `${rewards}`);
      
//       await timelock.freezeRewardsForAFiToken(afiBase.target);
      
//       await expect(timelock.connect(account1).stake(1, afiBase.target)).to.be.
//         revertedWith('Booster TL: Staking is frozen for this token');
//     });
//   });

//   describe('Unstake', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 100000000000000000000n);
//       await afiBase.setTotalSupply(1000000000000000000n);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(timelock.target, 7500000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should unstake", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target);

//       await time.increase(21);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);
//     });

//     it("Should get 0 reward for unstaking before the least staking time", async () => {
//       const currentTime = await time.latest();
      
//       await timelock.connect(account1).stake(1, afiBase.target);

//       await time.increase(7);
      
//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       expect((rewards)).to.equal(0);

//     });

//     it("Should get 0 reward for unstaking when NAV not changed", async () => {
      
//       await timelock.connect(account1).stake(1, afiBase.target);

//       await time.increase(11);
      
//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       expect((rewards)).to.equal(0);
//     });

//     it("Should get reward for unstaking when NAV changed", async () => {
      
//       await timelock.connect(account1).stake(1000000000000000000n, afiBase.target);

//       await time.increase(11);
//       await afiStorage.updateTVL(afiBase.target, 101000000000000000000n);
//       await afiBase.setTotalSupply(1000000000000000000n);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       expect((rewards)).to.equal(250000000000000000n);
//     });

//     it("unstake should fail for invalid index", async () => {
      
//       await timelock.connect(account1).stake(1, afiBase.target);

//       await time.increase(11);
//       await afiBase.setTotalSupply(10000);

//       await expect(timelock.connect(account1).unstake(1)).to.be.revertedWith('Booster TL: Invalid index');
//     });

//     it("unstake should fail if try to unstake again for same index", async () => {
      
//       await timelock.connect(account1).stake(1000000000000000000n, afiBase.target);

//       await time.increase(11);
//       await afiStorage.updateTVL(afiBase.target, 101000000000000000000n);
//       await afiBase.setTotalSupply(1000000000000000000n);
//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       expect((rewards)).to.equal(250000000000000000n);

//       await expect(timelock.connect(account1).unstake(0)).to.be.revertedWith('Booster TL: Already claimed');
//     });

//     it("should skip the time if the afi vault is frozen", async () => {
      
//       await timelock.connect(account1).stake(1000000000000000000n, afiBase.target);

//       await time.increase(11);

//       await afiStorage.updateTVL(afiBase.target, 101000000000000000000n);
//       await afiBase.setTotalSupply(1000000000000000000n);

//       await timelock.freezeRewardsForAFiToken(afiBase.target);

//       const isFrozen = await timelock.frozen(afiBase.target);

//       await time.increase(11);

//       expect(isFrozen[0]).to.equal(true);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       expect((rewards)).to.equal(250000000000000000n);
//     });

//     it("Should unstake to last index", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target);

//       await time.increase(50);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);
//       expect((stakingDetails[6])).to.equal(3);

//     });

//     it("Should unstake the staked amount only to last index and when END date is set but NAV not set", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target);

//       await timelock.setEndDate(afiBase.target, (currentTime + 300));

//       await time.increase(302);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);
//     });

//     it("Should unstake the staked amount only to last index and when END date is set but NAV not set ", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1000000000000000000n, afiBase.target);

//       await timelock.setEndDate(afiBase.target, (currentTime + 300));

//       await time.increase(302);

//       await timelock.connect(account1).unstake(0);

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("NAV at unstake", `${(stakingDetails[4])}`);
//       console.log("stakingDetails - amount", `${(stakingDetails[0])}`);
//       console.log("stakingDetails - start time", `${(stakingDetails[1])}`);
//       console.log("stakingDetails - token", `${(stakingDetails[2])}`);
//       console.log("stakingDetails - stakeNAV", `${(stakingDetails[3])}`);
//       console.log("stakingDetails - reward claimed", `${(stakingDetails[5])}`);
//       console.log("stakingDetails - duration index", `${(stakingDetails[6])}`);
//       console.log("stakingDetails - rate", `${(stakingDetails[7])}`);
//       console.log("stakingDetails - rewards collected", `${(stakingDetails[8])}`);
//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);
      
      
//       await afiStorage.updateTVL(afiBase.target, 101000000000000000000n);
//       await afiBase.setTotalSupply(1000000000000000000n);

//       await timelock.setEndNAV(afiBase.target);
//       var pendingReward = await timelock.connect(account1).pendingReward(afiBase.target, account1.address);
//       console.log("does user have pending rewards : ", pendingReward);
//       await timelock.connect(account1).claimPendingReward(0);
//       pendingReward = await timelock.connect(account1).pendingReward(afiBase.target, account1.address);
//       expect(pendingReward).to.equal(false);

//       stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("after reward claim user details");

//       console.log("NAV at unstake", `${(stakingDetails[4])}`);
//       console.log("stakingDetails - amount", `${(stakingDetails[0])}`);
//       console.log("stakingDetails - start time", `${(stakingDetails[1])}`);
//       console.log("stakingDetails - token", `${(stakingDetails[2])}`);
//       console.log("stakingDetails - stakeNAV", `${(stakingDetails[3])}`);
//       console.log("stakingDetails - reward claimed", `${(stakingDetails[5])}`);
//       console.log("stakingDetails - duration index", `${(stakingDetails[6])}`);
//       console.log("stakingDetails - rate", `${(stakingDetails[7])}`);
//       console.log("stakingDetails - rewards collected", `${(stakingDetails[8])}`);
//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);
//       await expect(timelock.connect(account1).claimPendingReward(0)).to.be.reverted;

//     });

//     it("Should fail unstake to last index and when END date is set but NAV not set", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target);

//       await timelock.setEndDate(afiBase.target, (currentTime + 300));
//       await timelock.setEndNAV(afiBase.target);

//       await time.increase(302);

//       await timelock.connect(account1).unstake(0);

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[4])}`);

//       expect((stakingDetails[8])).to.equal(true);
//       expect((stakingDetails[6])).to.equal(3);
//     });
//   });

//   describe('Withdraw Stray Token', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1000, 2000, 3000, 4000];

//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 30;
//       const lockDate2 = currentTime + 60;
//       const lockDate3 = currentTime + 90;
//       const lockDate4 = currentTime + 120;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockDateFactors = [78840000000, 157680000000, 315360000000]; // 315360000000 = 1% return per second

//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();
      
//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);
      
//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       await rewardToken.mint(owner.address, 750000000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should withdraw stray token", async () => {
//       const StrayToken = await ethers.getContractFactory("TestToken");
//       const strayToken = await StrayToken.deploy(owner);
//       strayToken.mint(timelock.target, (100));

//       await timelock.withdrawStrayToken(strayToken.target);
      
//       const contractBalance = ((await strayToken.balanceOf(timelock.target)));
//       var expectedBalance = ("0");
      
//       expect((contractBalance)).to.equal(expectedBalance);
      
//       const ownerBalance = ((await strayToken.balanceOf(owner.address)));
//       expectedBalance = ((100));
      
//       expect((ownerBalance)).to.equal((expectedBalance));
//     });

//     it("Should revert withdraw stray token if it is reward token", async () => {
//       const StrayToken = await ethers.getContractFactory("TestToken");
//       const strayToken = await StrayToken.deploy(owner);
//       strayToken.mint(timelock.target, (75000000000000000000n));
//       await expect(timelock.withdrawStrayToken(rewardToken.target)).to.be.reverted;
//     });

//     it("Should withdraw multiple stray tokens", async () => {
//       const StrayToken = await ethers.getContractFactory("TestToken");
//       const strayToken = await StrayToken.deploy(owner);
//       const strayToken1 = await StrayToken.deploy(owner);
    
//       strayToken.mint(timelock.target, (100));
//       strayToken1.mint(timelock.target, (10));

//       await timelock.withdrawStrayToken(strayToken.target);
//       await timelock.withdrawStrayToken(strayToken1.target);

//       var contractBalance = ((await strayToken.balanceOf(timelock.target)));
//       var expectedBalance = ("0");
      
//       expect((contractBalance)).to.equal(expectedBalance);

//       contractBalance = ((await strayToken1.balanceOf(timelock.target)));
//       expectedBalance = ("0");
      
//       expect((contractBalance)).to.equal(expectedBalance);

//       var ownerBalance = ((await strayToken.balanceOf(owner.address)));
//       expectedBalance = ((100));
      
//       expect((ownerBalance)).to.equal((expectedBalance));
     
//       ownerBalance = ((await strayToken1.balanceOf(owner.address)));
//       expectedBalance = ((10));
      
//       expect((ownerBalance)).to.equal((expectedBalance));
//     });

//     it("Should not withdraw stray token if not called by the owner", async () => {
//       const StrayToken = await ethers.getContractFactory("TestToken");
//       const strayToken = await StrayToken.deploy(owner);

//       strayToken.mint(timelock.address, (100));
//       await expect(timelock.connect(account1).withdrawStrayToken(strayToken)).to.be.reverted;
//     });
//   });

//   describe('Pause', async () => {

//     it("Should pause", async () => {
//       await timelock.pause();

//       const paused = (await timelock.paused());

//       expect(paused).to.equal(true);
//     });

//     it("Should not pause if already paused", async () => {
//       await timelock.pause();

//       var paused = (await timelock.paused());

//       expect(paused).to.equal(true);

//       await expect(timelock.pause()).to.be.revertedWithCustomError(timelock,'EnforcedPause');

//       paused = (await timelock.paused());
//     });

//     it("Should not pause if not called by the owner", async () => {
//       await expect(timelock.connect(account1).pause()).to.be.
//         reverted;
//     });

//   });

//   describe('unPause', async () => {

//     it("Should unPause", async () => {
//       await timelock.pause();

//       var paused = (await timelock.paused());
//       expect(paused).to.equal(true);

//       await timelock.unpause();
//       paused = (await timelock.paused());
//       expect(paused).to.equal(false);

//     });

//     it("Should not unpause if already unpaused", async () => {
    
//       await expect(timelock.unpause()).to.be.revertedWithCustomError(timelock,'ExpectedPause');

//       paused = (await timelock.paused());
//     });

//     it("Should not unpause if not called by the owner", async () => {
//       await timelock.pause();
//       await expect(timelock.connect(account1).unpause()).to.be.
//         reverted;
//     });

//   });

//   describe('Freeze Rewards For AFi Token', async () => {

//     beforeEach(async () => {
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();
      
//       await timelock.addAFiToken(afiBase.target);
//     });

//     it("Should freeze rewards for AFi token", async () => {
//       await timelock.freezeRewardsForAFiToken(afiBase.target);

//       const isFrozen = await timelock.frozen(afiBase.target);

//       expect(isFrozen[0]).to.equal(true);
//     });

//     it("Should freeze multiple AFi tokens", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       var isFrozen = await timelock.frozen(rewardToken.target);
//       expect(isFrozen[0]).to.equal(false);

//       await timelock.freezeRewardsForAFiToken(rewardToken.target);

//       isFrozen = await timelock.frozen(rewardToken.target);
//       expect(isFrozen[0]).to.equal(true);

//       await timelock.addAFiToken(account1.address);

//       isFrozen = await timelock.frozen(account1.address);
//       expect(isFrozen[0]).to.equal(false);

//       await timelock.freezeRewardsForAFiToken(account1.address);

//       isFrozen = await timelock.frozen(account1.address);
//       expect(isFrozen[0]).to.equal(true);
//     });

//     it("Should not freeze AFi token if address is 0 address", async () => {
//       await expect(timelock.freezeRewardsForAFiToken(zero_address)).to.be.revertedWith('Booster TL: Please enter a valid address');
//     });

//     it("Should not freeze AFi token if it's not added", async () => {
//       await expect(timelock.freezeRewardsForAFiToken(rewardToken.target)).to.be.revertedWith('Booster TL: Not an AFi token');
//     });

//     it("Should not freeze AFi token if already frozen", async () => {
//       await timelock.freezeRewardsForAFiToken(afiBase.target);

//       const isFrozen = await timelock.frozen(afiBase.target);

//       expect(isFrozen[0]).to.equal(true);

//       await expect(timelock.freezeRewardsForAFiToken(afiBase.target)).to.be.revertedWith('Booster TL: Token already frozen');
//     });

//     it("Should not freeze AFi token if not frozen by the owner", async () => {
//       await expect(timelock.connect(account1).freezeRewardsForAFiToken(afiBase.target)).to.be.
//         reverted;
//     });

//   });

//   describe('Pause Stake', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(owner.address, 7500000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Stake should fail if it is paused", async () => {
//       await timelock.pauseStake();
//       await expect(timelock.connect(account1).stake((1), afiBase.target)).to.be.revertedWith('Booster TL: Stake now paused');
//     });

//     it("pauseStake should fail if called by non owner", async () => {
//       await expect(timelock.connect(account1).pauseStake()).to.be.reverted;
//     });

//     it("pause stake should  ", async () => {
//       await timelock.pauseStake();
//       await expect(timelock.pauseStake()).to.be.revertedWith('Booster TL: Already Paused');
//     });
//   });

//   describe('set details call', async () => {

//     beforeEach(async () => {
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);


//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//     });

//     it("setLockDetails should fail when called from a non owner wallet", async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
//       await expect(timelock.connect(account1).setLockDateDetails(lockPeriods, lockFactors)).to.be.reverted;
//     });

//     it("setLockDetails should fail when contract not paused", async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
//       await timelock.unpause();
//       await expect(timelock.setLockDateDetails(lockPeriods, lockFactors)).to.be.reverted;
//     });

//     it("setLockDetails should fail when contract not paused", async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
//       await timelock.unpause();
//       await expect(timelock.setLockDateDetails(lockPeriods, lockFactors)).to.be.reverted;
//     });

//     it("setLockDetails should fail when length mismatch", async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3];
//       var lockFactors = [25, 50, 75, 100];
//       await expect(timelock.setLockDateDetails(lockPeriods, lockFactors)).to.be.revertedWith('Booster TL: Array lengths not appropriate');
//     });
//   });

//   describe('set EndDate and NAV', async () => {

//     beforeEach(async () => {
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//     });

//     it("set end date and nav from owner wallet ", async () => {
//       const currentTime = await time.latest();
//       await timelock.setEndDate(afiBase.target, (currentTime + 300));
//       await timelock.setEndNAV(afiBase.target);
//     });

//     it("set end date and nav from non owner wallet", async () => {
//       const currentTime = await time.latest();
//       await expect(timelock.connect(account1).setEndDate(afiBase.target, (currentTime + 300))).to.be.reverted;
//       await expect(timelock.connect(account1).setEndNAV(afiBase.target)).to.be.reverted;
//     });

//     it("set end date and nav from non owner wallet", async () => {
//       const currentTime = await time.latest();
//       await expect(timelock.connect(account1).setEndDate(afiBase.target, (currentTime + 300))).to.be.reverted;
//       await expect(timelock.connect(account1).setEndNAV(afiBase.target)).to.be.reverted;
//     });

//   });

  
//   describe('Tokenomics', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(timelock.target, 750000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should get reward for unstaking when NAV changed according to the calculation", async () => {

//       await afiStorage.updateTVL(afiBase.target, 197367776515789400000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       await timelock.connect(account1).stake(1019368772582116548n, afiBase.target);
//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);
//       expect((stakingDetails[3])).to.equal(977373);

//       await time.increase(11);
//       await afiStorage.updateTVL(afiBase.target, 197391336043463100000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       await timelock.connect(account1).unstake(0);
//       stakingDetails = await timelock.stakingDetails(account1.address, 0);
//       console.log("NAV at unstake", `${(stakingDetails[4])}`);
//       console.log("stakingDetails - amount", `${(stakingDetails[0])}`);
//       console.log("stakingDetails - start time", `${(stakingDetails[1])}`);
//       console.log("stakingDetails - token", `${(stakingDetails[2])}`);
//       console.log("stakingDetails - stakeNAV", `${(stakingDetails[3])}`);
//       console.log("stakingDetails - reward claimed", `${(stakingDetails[5])}`);
//       console.log("stakingDetails - duration index", `${(stakingDetails[6])}`);
//       console.log("stakingDetails - rate", `${(stakingDetails[7])}`);
//       console.log("stakingDetails - rewards collected", `${(stakingDetails[8])}`);

//       expect((stakingDetails[8])).to.equal(true);

//       const rewards = await timelock.totalRewardsDistributed();
//       console.log("rewards", rewards);

//       expect((rewards)).to.equal(2981653659802690n);
//     });
//   });

    
//   describe('Tokenomics and reward details', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(timelock.target, 750000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should get reward for unstaking when NAV changed according to the calculation", async () => {

//       await afiStorage.updateTVL(afiBase.target, 197367776515789400000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       await timelock.connect(account1).stake(1019368772582116548n, afiBase.target);
//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);
//       expect((stakingDetails[3])).to.equal(977373);

//       await time.increase(11);

//       await afiStorage.updateTVL(afiBase.target, 197391336043463100000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       const details = await timelock.connect(account1).accruedReward(account1.address, 0);
//       console.log(details[0], details[1], details[2], details[3]);

//       expect((details[0])).to.equal(2981653659802690n);
//     });
//   });

   
//   describe('Tokenomics and reward details', async () => {

//     beforeEach(async () => {
//       const lockPeriod1 = 10;
//       const lockPeriod2 = lockPeriod1 + 10;
//       const lockPeriod3 = lockPeriod2 + 10;
//       const lockPeriod4 = lockPeriod3 + 10;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [25, 50, 75, 100];
     
//       const AfiBase = await ethers.getContractFactory("AFiBaseMock");
//       afiBase = await AfiBase.deploy();

//       const AfiStorage = await ethers.getContractFactory("StorageMock");
//       afiStorage = await AfiStorage.deploy();
//       console.log("afiBase", afiBase.target)
//       console.log("afiStorage", afiStorage.target)

//       await afiBase.setAFiStorage(afiStorage.target);
//       await afiStorage.updateTVL(afiBase.target, 10000);
//       await afiBase.setTotalSupply(100000);

//       //set user deposit nav
//       await afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       console.log("paused");
//       await timelock.setLockDateDetails(lockPeriods, lockFactors);
//       await rewardToken.mint(timelock.target, 750000000000000000000n);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.unpause();
//     });

//     it("Should get reward for unstaking when NAV changed according to the calculation", async () => {

//       await afiStorage.updateTVL(afiBase.target, 197428455348888000000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       await timelock.connect(account1).stake(1019368772582116548n, afiBase.target);
//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);
//       expect((stakingDetails[3])).to.equal(977674);

//       await time.increase(11);

//       await afiStorage.updateTVL(afiBase.target, 197448187111007560000n);
//       await afiBase.setTotalSupply(2019368772582116548n);

//       const details = await timelock.connect(account1).accruedReward(account1.address, 0);
//       console.log(details[0], details[1], details[2], details[3]);

//       expect((details[0])).to.equal(2471969273511632n);
//     });
//   });
// });

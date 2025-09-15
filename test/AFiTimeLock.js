// const { ethers } = require('hardhat');
// const { expect } = require('chai');
// const { BigNumber } = require('ethers');
// const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


// describe("AFiTimeLock", () => {

//   let rewardToken;
//   let timelock;
//   let owner, account1, account2;
//   let afiBase;

//   const zero_address = "0x0000000000000000000000000000000000000000";

//   beforeEach(async () => {

//     const currentTime = await time.latest();
//     deadline = currentTime + (60 * 60);

//     // Contracts are deployed using the first signer/account by default
//     [owner, account1, account2] = await ethers.getSigners();

//     const RewardToken = await ethers.getContractFactory("TestToken");
//     rewardToken = await RewardToken.deploy(owner);

//     const Timelock = await ethers.getContractFactory("AFiTimeLock");
//     timelock = await Timelock.deploy(rewardToken.target);

//     await expect(Timelock.deploy(zero_address)).to.be.revertedWith('TimeLock: Please enter a valid address');

//   });

//   context('Set Cap', async () => {

//     beforeEach(async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 10;
//       const lockDate2 = currentTime + 60;
//       const lockDate3 = currentTime + 90;
//       const lockDate4 = currentTime + 120;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockDateFactors = [78840000000, 157680000000, 315360000000]; // 315360000000 = 1% return per second

//       await timelock.pause();
//       await timelock.setLockDateDetails(lockDates, lockDateFactors);
//       await rewardToken.mint(owner.address, 10000);
//       await rewardToken.approve(timelock.target, 10000);
//     });

//     it("Should set cap", async () => {
//       await timelock.setCap((1000));

//       const cap = (await timelock.cap());
//       const expectedCap = 1000;
//       const timelockRewardBalance = await rewardToken.balanceOf(timelock.target);

//       expect(cap).to.equal(expectedCap);
//       expect(cap).to.equal(timelockRewardBalance);
//     });

//     it("Should update cap", async () => {
//       await timelock.setCap(1000);

//       var cap = ((await timelock.cap()));
//       var expectedCap = 1000;
//       var timelockRewardBalance = await rewardToken.balanceOf(timelock.target);

//       expect(cap).to.equal(expectedCap);
//       expect(cap).to.equal(timelockRewardBalance);

//       await timelock.setCap(2000);

//       cap = (await timelock.cap());
//       expectedCap = 2000;
//       timelockRewardBalance = await rewardToken.balanceOf(timelock.target);

//       expect(cap).to.equal(expectedCap);
//       expect(cap).to.equal(timelockRewardBalance);
//     });

//     it("Should not set cap if cap is 0", async () => {
//       await expect(timelock.setCap(0)).to.be.revertedWith('TimeLock: Cap must be greater than current cap');
      
//       await timelock.setCap(1000);
      
//       await expect(timelock.setCap(500)).to.be.revertedWith('TimeLock: Cap must be greater than current cap');
//     });

//     it("Should not set cap if unpaused", async () => {
//       await timelock.unpause();
//       await expect(timelock.setCap(10)).to.be.revertedWithCustomError(timelock,'ExpectedPause');
//     });

//     it("Should not set cap if not set by the owner", async () => {
//       await expect(timelock.connect(account1).setCap(10)).to.be.
//         reverted;
//     });

//   });

//   describe('Set Base Rate', async () => {

//     beforeEach(async () => {
//       await timelock.pause();
//     });

//     it("Should set base rate", async () => {
//       await timelock.setBaseRate((1000));

//       const baseRate = (await timelock.baseRate());
//       const expectedBaseRate = 1000;

//       expect(baseRate).to.equal(expectedBaseRate);
//     });

//     it("Should not update base rate", async () => {
//       await timelock.setBaseRate(1000);

//       var baseRate = ((await timelock.baseRate()));
//       var expectedBaseRate = 1000;

//       expect(baseRate).to.equal(expectedBaseRate);

//       await expect(timelock.setBaseRate(100)).to.be.revertedWith('TimeLock: base rate initialized already');

//       baseRate = (await timelock.baseRate());

//       expect(baseRate).to.equal(expectedBaseRate);
//     });

//     it("Should not set base rate if base rate is 0", async () => {
//       await expect(timelock.setBaseRate(0)).to.be.revertedWith('TimeLock: base rate must be greater than 0');
//     });

//     it("Should not set base rate if base rate is more than 10%", async () => {
//       await expect(timelock.setBaseRate(1001)).to.be.revertedWith('TimeLock: base rate cannot exceed 10%');
//     });

//     it("Should not set base rate if unpaused", async () => {
//       await timelock.unpause();
//       await expect(timelock.setBaseRate(10)).to.be.revertedWithCustomError(timelock,'ExpectedPause');
//     });

//     it("Should not set base rate if not set by the owner", async () => {
//       await expect(timelock.connect(account1).setBaseRate(10)).to.be.
//         reverted;
//     });

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
//       await expect(timelock.addAFiToken(zero_address)).to.be.revertedWith('TimeLock: Please enter a valid address');
//     });

//     it("Should not add AFi token if already added", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       const isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       await expect(timelock.addAFiToken(rewardToken.target)).to.be.revertedWith('TimeLock: Already added');
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
//         revertedWith('TimeLock: Please enter a valid address');
//     });

//     it("Should not remove AFi token if already removed", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       var isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(true);

//       await timelock.removeAFiToken(rewardToken.target);

//       isAFi = await timelock.isAFiToken(rewardToken.target);

//       expect(isAFi).to.equal(false);            

//       await expect(timelock.removeAFiToken(rewardToken.target)).to.be.revertedWith('TimeLock: Not added yet');
//     });

//     it("Should not remove AFi token if not removed by the owner", async () => {
//       await timelock.addAFiToken(rewardToken.target);

//       await expect(timelock.connect(account1).removeAFiToken(rewardToken.target)).to.be.
//         reverted;
//     });

//   });

//   describe('Set Lock Date Details', async () => {

//     beforeEach(async () => {
//       await timelock.pause();
//     });

//     it("Should set lock date details", async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 10;
//       const lockDate2 = lockDate1 + 60;
//       const lockDate3 = lockDate2 + 60;
//       const lockDate4 = lockDate3 + 60;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];

//       var lockFactors = [1, 2, 3];

//       await timelock.setLockDateDetails(lockDates, lockFactors);

//       var lDate = (await timelock.lockDates(0));

//       expect(lDate).to.equal(lockDate1);

//       lDate = (await timelock.lockDates(1));
//       expect(lDate).to.equal((lockDate2));

//       lDate = ((await timelock.lockDates(2)));
//       expect(lDate).to.equal((lockDate3));

//       lDate = (await timelock.lockDates(3));
//       expect(lDate).to.equal((lockDate4));

//       var lFactor = ((await timelock.lockDateFactor(0)));
//       expect(lFactor).to.equal((lockFactors[0]));

//       lFactor = ((await timelock.lockDateFactor(1)));
//       expect(lFactor).to.equal((lockFactors[1]));

//       lFactor = ((await timelock.lockDateFactor(2)));
//       expect(lFactor).to.equal((lockFactors[2]));

//       const lDateNum = ((await timelock.numLockDates()));
//       expect(lDateNum).to.equal((lockDates.length));
//     });

//     it("Should not update lock date details", async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 60;
//       const lockDate2 = lockDate1 + 60;
//       const lockDate3 = lockDate2 + 60;
//       const lockDate4 = lockDate3 + 60;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockFactors = [1, 2, 3];

//       await timelock.setLockDateDetails(lockDates, lockFactors);

//       lockDates = [lockDate4, lockDate3, lockDate2];
//       lockFactors = [3, 2];

//       await expect(timelock.setLockDateDetails(lockDates, lockFactors)).to.be.
//         revertedWith('TimeLock: Lock dates initialized already');
//     });

//     it("Should not set lock date details if array lengths aren't appropriate", async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 60;
//       const lockDate2 = lockDate1 + 60;
//       const lockDate3 = lockDate2 + 60;
//       const lockDate4 = lockDate3 + 60;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockFactors = [1, 2, 3, 4];

//       await expect(timelock.setLockDateDetails(lockDates, lockFactors)).to.be.
//         revertedWith('TimeLock: Array lengths not appropriate');
//     });

//     it("Should not set lock date details if not paused", async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 60;
//       const lockDate2 = lockDate1 + 60;
//       const lockDate3 = lockDate2 + 60;
//       const lockDate4 = lockDate3 + 60;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockFactors = [1, 2, 3];

//       await timelock.unpause();

//       await expect(timelock.setLockDateDetails(lockDates, lockFactors)).to.be.
//         revertedWithCustomError(timelock,'ExpectedPause');
//     });

//     it("Should not set lock date details if not called by the owner", async () => {
//       const currentTime = await time.latest();

//       const lockDate1 = currentTime + 60;
//       const lockDate2 = lockDate1 + 60;
//       const lockDate3 = lockDate2 + 60;
//       const lockDate4 = lockDate3 + 60;

//       var lockDates = [lockDate1, lockDate2, lockDate3, lockDate4];
//       var lockFactors = [1, 2, 3];

//       await expect(timelock.connect(account1).setLockDateDetails(lockDates, lockFactors)).to.be.
//         reverted;
//     });

//   });

//   describe('Set Lock Period Details', async () => {

//     beforeEach(async () => {
//       await timelock.pause();
//     });

//     it("Should set lock period details", async () => {
//       const lockPeriod1 = 60;
//       const lockPeriod2 = lockPeriod1 + 60;
//       const lockPeriod3 = lockPeriod2 + 60;
//       const lockPeriod4 = lockPeriod3 + 60;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1, 2, 3, 4];

//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);

//       var lPeriod = ((await timelock.lockPeriods(0)));
//       expect((lPeriod)).to.equal((lockPeriod1));

//       lPeriod = ((await timelock.lockPeriods(1)));
//       expect((lPeriod)).to.equal((lockPeriod2));

//       lPeriod = ((await timelock.lockPeriods(2)));
//       expect((lPeriod)).to.equal((lockPeriod3));

//       lPeriod = ((await timelock.lockPeriods(3)));
//       expect((lPeriod)).to.equal((lockPeriod4));

//       var lFactor = ((await timelock.lockPeriodFactor(0)));
//       expect((lFactor)).to.equal((lockFactors[0]));

//       lFactor = ((await timelock.lockPeriodFactor(1)));
//       expect((lFactor)).to.equal((lockFactors[1]));

//       lFactor = ((await timelock.lockPeriodFactor(2)));
//       expect((lFactor)).to.equal((lockFactors[2]));

//       lFactor = ((await timelock.lockPeriodFactor(3)));
//       expect((lFactor)).to.equal((lockFactors[3]));

//       const lPeriodNum = ((await timelock.numLockPeriods()));
//       expect((lPeriodNum)).to.equal((lockPeriods.length));
//     });

//     it("Should not update lock period details", async () => {
//       const lockPeriod1 = 60;
//       const lockPeriod2 = lockPeriod1 + 60;
//       const lockPeriod3 = lockPeriod2 + 60;
//       const lockPeriod4 = lockPeriod3 + 60;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1, 2, 3, 4];

//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);

//       lockPeriods = [lockPeriod4, lockPeriod3, lockPeriod2];
//       lockFactors = [4, 3, 2];

//       await expect(timelock.setLockPeriodDetails(lockPeriods, lockFactors)).to.be.
//         revertedWith('TimeLock: Lock periods initialized already');

//     });

//     it("Should not set lock period details if array lengths aren't equal", async () => {
//       const lockPeriod1 = 60;
//       const lockPeriod2 = lockPeriod1 + 60;
//       const lockPeriod3 = lockPeriod2 + 60;
//       const lockPeriod4 = lockPeriod3 + 60;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1, 2, 3];

//       await expect(timelock.setLockPeriodDetails(lockPeriods, lockFactors)).to.be.
//         revertedWith('TimeLock: Array lengths should be equal');
//     });

//     it("Should not set lock period details if not paused", async () => {
//       const lockPeriod1 = 60;
//       const lockPeriod2 = lockPeriod1 + 60;
//       const lockPeriod3 = lockPeriod2 + 60;
//       const lockPeriod4 = lockPeriod3 + 60;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1, 2, 3, 4];

//       await timelock.unpause();

//       await expect(timelock.setLockPeriodDetails(lockPeriods, lockFactors)).to.be.
//         revertedWithCustomError(timelock,'ExpectedPause');
//     });

//     it("Should not set lock period details if not called by the owner", async () => {
//       const lockPeriod1 = 60;
//       const lockPeriod2 = lockPeriod1 + 60;
//       const lockPeriod3 = lockPeriod2 + 60;
//       const lockPeriod4 = lockPeriod3 + 60;

//       var lockPeriods = [lockPeriod1, lockPeriod2, lockPeriod3, lockPeriod4];
//       var lockFactors = [1, 2, 3, 4];

//       await expect(timelock.connect(account1).setLockPeriodDetails(lockPeriods, lockFactors)).to.be.
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
//       afiBase.setDepNAV(account1.address, 1000000);

//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       await timelock.setLockDateDetails(lockDates, lockDateFactors);
//       await rewardToken.mint(owner.address, 1000);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.setCap((1000));
//       await timelock.setBaseRate(100);
//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);
//       await timelock.unpause();
//     });

//     it("Should stake", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 30);
//       await timelock.connect(account1).stake((1),afiBase.target,1);
//       const totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect(totalRewards).to.equal(((10)));

//       const stakingDetails = await timelock.stakingDetails(account1.address,0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);
//       console.log("stakingDetails - reward amount", `${stakingDetails[6]}`);

//       expect((stakingDetails[2])).to.equal((1));
//       expect(stakingDetails[3]).to.equal(afiBase.target);
//       expect((stakingDetails[6])).to.equal(((10)));
//       expect(stakingDetails[7]).to.equal(false);

//       const cap = ((await timelock.cap()));
//       const expectedCap = 1000;

//       expect(cap).to.equal(expectedCap);
//     });

//     it("Should be able to stake multiple time", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake((1),afiBase.target,1);
      
//       await time.increase(30);
      
//       await timelock.connect(account1).stake((1),afiBase.target,3);
      
//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect(totalRewards).to.equal((90));

//       var stakingDetails = await timelock.stakingDetails(account1.address,0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);
//       console.log("stakingDetails - reward amount", `${stakingDetails[6]}`);

//       expect(stakingDetails[2]).to.equal((1));
//       expect(stakingDetails[3]).to.equal(afiBase.target);
//       expect(stakingDetails[6]).to.equal(10);
//       expect(stakingDetails[7]).to.equal(false);

//       stakingDetails = await timelock.stakingDetails(account1.address,1);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);
//       console.log("stakingDetails - reward amount", `${stakingDetails[6]}`);

//       expect(stakingDetails[2]).to.equal((3));
//       expect(stakingDetails[3]).to.equal(afiBase.target);
//       expect(stakingDetails[6]).to.equal(80);
//       expect(stakingDetails[7]).to.equal(false);

//       const totalRewardsDistributed = ((await timelock.totalRewardsDistributed()));
//       const expectedTotalRewards = 90;

//       expect(totalRewardsDistributed).to.equal(expectedTotalRewards);
//     });

//     it("Should revert when staking period is not started", async () => {
//       await expect(timelock.connect(account1).stake(1,afiBase.target,1)).to.be.revertedWith('TimeLock: Not the time to stake');

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect(totalRewards).to.equal(0);

//       var stakingDetails = await timelock.stakingDetails(account1.address,0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`)
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);
//       console.log("stakingDetails - reward amount", `${stakingDetails[6]}`);
      
//       expect(stakingDetails[2]).to.equal(0);
//       expect(stakingDetails[3]).to.equal(zero_address);
//       expect(stakingDetails[6]).to.equal(0);
//       expect(stakingDetails[7]).to.equal(false); 
//     });

//     it("Should revert when staking period has ended", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 121);

//       await expect(timelock.connect(account1).stake(1,afiBase.target,1)).to.be.revertedWith('TimeLock: Not the time to stake');

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect(totalRewards).to.equal(0);
//     });

//     it("Should revert when trying to stake non afi-token", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await expect(timelock.connect(account1).stake(1, account2, 1)).to.be.
//         revertedWith('TimeLock: This token is not stakable');
//     });

//     it("Should revert when trying stake zero amount", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 30);

//       await expect(timelock.connect(account1).stake(0, afiBase.target, 1)).to.be.
//         revertedWith('TimeLock: Amount must be greater than 0');
//     });

//     it("Should revert when paused", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake(90, afiBase.target, 1)
      
//       const rewards =  (await timelock.totalRewardsDistributed());
//       console.log("stakingDetails - amount staked", `${rewards}`);
      
//       await timelock.pause();
//       await expect(timelock.connect(account1).stake(1,afiBase.target,1)).to.be.
//         revertedWithCustomError(timelock,'EnforcedPause');
//     });

//     it("Should revert when AFi token is frozen", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake(90, afiBase.target, 1)
      
//       const rewards =  (await timelock.totalRewardsDistributed());
//       console.log("stakingDetails - amount staked", `${rewards}`);
      
//       await timelock.freezeRewardsForAFiToken(afiBase.target);
      
//       await expect(timelock.connect(account1).stake(1,afiBase.target,1)).to.be.
//         revertedWith('TimeLock: Staking is frozen for this token');
//     });

//     it("Should revert when cap amount reached", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);
      
//       await timelock.connect(account1).stake(90, afiBase.target, 1)
      
//       const rewards =  (await timelock.totalRewardsDistributed());
//       console.log("stakingDetails - amount staked", `${rewards}`);

//       await expect(timelock.connect(account1).stake(11,afiBase.target,1)).to.be.revertedWith('TimeLock: Reward cap reached');
//     });

//   });

//   describe('Unstake', async () => {

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
//       await afiBase.setDepNAV(account2.address, 2000000);
      
//       await timelock.addAFiToken(afiBase.target);
//       await timelock.pause();
//       await timelock.setLockDateDetails(lockDates, lockDateFactors);
//       await rewardToken.mint(owner.address, 1000);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.setCap(1000);
//       await timelock.setBaseRate(100);
//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);
//       await timelock.unpause();
//     });

//     it("Should unstake", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target, 1);

//       await time.increase(21);

//       await timelock.connect(account1).unstake(0);

//       const totalRewards = ((await timelock.totalRewardsDistributed()));
//       const rewardBalance = ((await rewardToken.balanceOf(account1.address)));

//       expect((totalRewards)).to.equal(10);

//       expect((rewardBalance)).to.equal((totalRewards));

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);

//       expect((stakingDetails[7])).to.equal(true);
//     });

//     it("Should get 0 reward for unstaking before the 1st lock period", async () => {
//       const currentTime = await time.latest();
      
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake(1, afiBase.target, 1);

//       await time.increase(7);
      
//       await timelock.connect(account1).unstake(0);

//       const totalRewards = ((await timelock.totalRewardsDistributed()));
//       var rewardBalance = ((await rewardToken.balanceOf(account1.address)));

//       expect((totalRewards)).to.equal(0);

//       expect((rewardBalance)).to.equal((totalRewards));

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);

//       expect((stakingDetails[7])).to.equal(true);
//     });

//     it("Should be able to unstake multiple times", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1 );

//       await time.increase(30);

//       await timelock.connect(account1).stake(1, afiBase.target, 3);

//       await time.increase(40);

//       await timelock.connect(account1).unstake(0);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect((totalRewards)).to.equal(((90)));

//       var rewardBalance = ((await rewardToken.balanceOf(account1.address)));
//       expect((rewardBalance)).to.equal(((10)));

//       await timelock.connect(account1).unstake(1);

//       rewardBalance = (await rewardToken.balanceOf(account1.address));
//       expect((rewardBalance)).to.equal((totalRewards));

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);
//       expect((stakingDetails[7])).to.equal((true));

//       stakingDetails = await timelock.stakingDetails(account1.address, 1);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);
//       expect((stakingDetails[7])).to.equal((true));
//     });

//     it("Should unstake and disburse rewards according to the time the amount was staked", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((10), afiBase.target, 1 );

//       await time.increase(10);

//       var totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect((totalRewards)).to.equal(((100)));

//       await timelock.connect(account1).unstake(0);

//       totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect((totalRewards)).to.equal(25);

//       var rewardBalance = (await rewardToken.balanceOf(account1.address));
//       expect((rewardBalance)).to.equal(((25)));

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);
//       expect((stakingDetails[7])).to.equal(true);
//     });

//     it("Should unstake and calculate rewards only till the time the AFi token was frozen", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((10), afiBase.target, 1);

//       await time.increase(10);

//       await timelock.freezeRewardsForAFiToken(afiBase.target);

//       var totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect((totalRewards)).to.equal(((100)));

//       await time.increase(20);

//       await timelock.connect(account1).unstake(0);

//       totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect((totalRewards)).to.equal(25);

//       var rewardBalance = (await rewardToken.balanceOf(account1.address));
//       expect((rewardBalance)).to.equal(((25)));

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       expect((stakingDetails[7])).to.equal(true);
//     });

//     it("Should unstake(multiple times) and disburse rewards according to the time the amount was staked", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((10), afiBase.target, 1 );

//       await time.increase(10);

//       await timelock.connect(account1).stake((1), afiBase.target, 3 );

//       await timelock.connect(account1).unstake(0);

//       var rewardBalance = ((await rewardToken.balanceOf(account1.address)));
//       expect((rewardBalance)).to.equal(25);

//       await time.increase(20);

//       var totalRewards =  ((await timelock.totalRewardsDistributed()));
    
//       expect((totalRewards)).to.equal(65);

//       await timelock.connect(account1).unstake(1);

//       totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect((totalRewards)).to.equal(35);

//       rewardBalance = ((await rewardToken.balanceOf(account1.address)));
//       expect((rewardBalance)).to.equal((totalRewards));

//       var stakingDetails = await timelock.stakingDetails(account1.address, 0);
//       expect((stakingDetails[7])).to.equal(true);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);

//       stakingDetails = await timelock.stakingDetails(account1.address, 1);
//       expect((stakingDetails[7])).to.equal(true);

//       console.log("stakingDetails - reward claimed", `${(stakingDetails[7])}`);
//     });

//     it("Should revert when staking index is greater than or eqaul to the number of stakes", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1);

//       await time.increase(20);

//       await timelock.connect(account1).unstake(0);

//       await expect(timelock.connect(account1).unstake(1)).to.be.revertedWith('TimeLock: Invalid index');

//       await expect(timelock.connect(account1).unstake(2)).to.be.revertedWith('TimeLock: Invalid index');

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       const rewardBalance = ((await rewardToken.balanceOf(account1.address)));

//       expect((totalRewards)).to.equal(((10)));
//       expect((rewardBalance)).to.equal((totalRewards));
//     });

//     it("Should revert when trying to unstake twice(already claimed)", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1);

//       await time.increase(20);

//       await timelock.connect(account1).unstake(0);

//       await expect(timelock.connect(account1).unstake(0)).to.be.revertedWith('TimeLock: Already claimed');

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       const rewardBalance = ((await rewardToken.balanceOf(account1.address)));

//       expect((totalRewards)).to.equal(((10)));
//       expect((rewardBalance)).to.equal((totalRewards));
//     });

//   });

//   describe('Withdraw Unclaimed Rewards', async () => {

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
//       await timelock.setLockDateDetails(lockDates, lockDateFactors);
//       await rewardToken.mint(owner.address, 100);
//       await rewardToken.approve(timelock.target, 100);
//       await timelock.setCap((100));
//       await timelock.setBaseRate(100);
//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);
//       await timelock.unpause();
//     });

//     it("Should withdraw all unclaimed rewards", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 121);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect(totalRewards).to.equal((0));

//       var tokenBalance = ((await rewardToken.balanceOf(owner.address)));
//       expect(tokenBalance).to.equal(((0)));
      
//       await timelock.withdrawUnclaimedRewards();

//       tokenBalance = ((await rewardToken.balanceOf(owner.address)));
//       expect(tokenBalance).to.equal(((100)));
//     });

//     it("Should withdraw partially unclaimed rewards", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect(totalRewards).to.equal(((10)));

//       const stakingDetails = await timelock.stakingDetails(account1.address, 0);

//       console.log("stakingDetails - amount staked", `${(stakingDetails[0])}`);
//       console.log("stakingDetails - duration index", `${stakingDetails[2]}`);
//       console.log("stakingDetails - afi token address", `${stakingDetails[3]}`);
//       console.log("stakingDetails - reward amount", `${stakingDetails[6]}`);

//       await time.increaseTo(currentTime + 121);

//       var tokenBalance = ((await rewardToken.balanceOf(owner.address)));
//       expect(tokenBalance).to.equal(((0)));

//       await timelock.withdrawUnclaimedRewards();

//       tokenBalance = ((await rewardToken.balanceOf(owner.address)));      
//       expect(tokenBalance).to.equal(((90)));
//     });

//     it("Should revert when staking period has not ended", async () => {
//       const currentTime = await time.latest();
//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));

//       expect(totalRewards).to.equal(((10)));

//       await expect(timelock.connect(owner).withdrawUnclaimedRewards()).to.be.revertedWith('TimeLock: Staking is in progress');
//     });

//     it("Should revert when unclaimed rewards are 0", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((10), afiBase.target, 1);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect(totalRewards).to.equal(((100)));

//       await time.increaseTo(currentTime + 121);

//       await timelock.connect(account1).unstake(0);

//       await expect(timelock.withdrawUnclaimedRewards()).to.be.revertedWith('TimeLock: No unclaimed rewards');
//     });

//     it("Should revert when not called by the owner", async () => {
//       const currentTime = await time.latest();

//       await time.increaseTo(currentTime + 30);

//       await timelock.connect(account1).stake((1), afiBase.target, 1);

//       const totalRewards =  ((await timelock.totalRewardsDistributed()));
//       expect(totalRewards).to.equal(((10)));

//       await timelock.connect(account1).unstake(0);

//       await time.increaseTo(currentTime + 121);

//       await expect(timelock.connect(account2).withdrawUnclaimedRewards()).to.be.
//         reverted;
//     });

//   })

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
//       await timelock.setLockDateDetails(lockDates, lockDateFactors);
//       await rewardToken.mint(owner.address, 1000);
//       await rewardToken.approve(timelock.target, 1000);
//       await timelock.setCap((100));
//       await timelock.setBaseRate(100);
//       await timelock.setLockPeriodDetails(lockPeriods, lockFactors);
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

//     it("Should not withdraw stray token if the token is reward token", async () => {
//       await expect(timelock.withdrawStrayToken(rewardToken.target)).to.be.
//         revertedWith('TimeLock: cannot withdraw reward token');
//     });

//     it("Should not withdraw stray token if not called by the owner", async () => {
//       const StrayToken = await ethers.getContractFactory("TestToken");
//       const strayToken = await StrayToken.deploy(owner);

//       strayToken.mint(timelock.address, (100));

//       await expect(timelock.connect(account1).withdrawStrayToken(strayToken)).to.be.
//         reverted;
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
//       await expect(timelock.freezeRewardsForAFiToken(zero_address)).to.be.revertedWith('TimeLock: Please enter a valid address');
//     });

//     it("Should not freeze AFi token if it's not added", async () => {
//       await expect(timelock.freezeRewardsForAFiToken(rewardToken.target)).to.be.revertedWith('TimeLock: Not an AFi token');
//     });

//     it("Should not freeze AFi token if already frozen", async () => {
//       await timelock.freezeRewardsForAFiToken(afiBase.target);

//       const isFrozen = await timelock.frozen(afiBase.target);

//       expect(isFrozen[0]).to.equal(true);

//       await expect(timelock.freezeRewardsForAFiToken(afiBase.target)).to.be.revertedWith('TimeLock: Token already frozen');
//     });

//     it("Should not freeze AFi token if not frozen by the owner", async () => {
//       await expect(timelock.connect(account1).freezeRewardsForAFiToken(afiBase.target)).to.be.
//         reverted;
//     });

//   });

// });

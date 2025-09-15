require("@nomicfoundation/hardhat-toolbox");
require('hardhat-contract-sizer');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  settings: {
    metadata: {
      bytecodeHash: 'none',
    },
    optimizer: {
      enabled: true,
      runs: 10, // Typical range is 200–1000; higher = cheaper runtime, lower = cheaper deploy
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // rinkeby: {
    //   url: https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY},
    //   accounts: {
    //     mnemonic: process.env.TESTNET_MNEMONIC,
    //   },
    // },
    // testnet: {
    //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //   chainId: 97,
    //   gasPrice: 20000000000,
    //   accounts: {
    //     mnemonic: process.env.TESTNET_MNEMONIC,
    //   },
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_FOR_TESTNET,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

  gasReporter: {
    enabled: false,
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },

};

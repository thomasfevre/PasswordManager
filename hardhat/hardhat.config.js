require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config({ path: __dirname + '/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA,
      chainId: 11155111,
      accounts: [process.env.METAMASK_PKEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY
  },
  function (webpackEnv) {
    // ...
    return {
     // ...
      resolve: {
        // ...
        fallback: {
          "assert": require.resolve("assert"),
          "stream": require.resolve("stream-browserify")
        }
      }
    }
  }
}

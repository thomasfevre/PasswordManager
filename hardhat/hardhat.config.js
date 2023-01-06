require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: __dirname + '/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/",
      chainId: 11155111,
      accounts: [process.env.METAMASK_PKEY],
    },
  },
};

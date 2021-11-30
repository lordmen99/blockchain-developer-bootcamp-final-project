const HDWalletProvider = require('@truffle/hdwallet-provider');
const { projectId, mnemonic } = require('./secrets.json');

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${projectId}`),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",  
      settings: {          
       optimizer: {
         enabled: false,
         runs: 200
       }
      //  evmVersion: "byzantium"
      }
    }
  }
};

// const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
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

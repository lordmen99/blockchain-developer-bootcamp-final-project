# Final Project: Bank App + ERC20 Token
***Category***: DeFi
```
project
│   README.md
│   design_pattern_decisions.md
│   avoiding_common_attacks.md    
│   truffle-config.js
└───contracts
│   │   Galleon.sol
│   │   Gringotts.sol
│   │   Migrations.sol
└───migrations
│   │   1_initial_migration.js
│   │   2_deploy_contract.js
└───src
│   └───abis
│       │   Galleon.json
│       │   Gringotts.json
│   └───App.js
│   └───index.js
└───test
│       │   Gringotts.test.js

```
## Installation
#### Clone this repository  
`git clone https://github.com/cybergirldinah/blockchain-developer-bootcamp-final-project`

#### Install Depedencies  
`npm install`  

#### truffle-config.js settings for testing
```
development: {
     host: "127.0.0.1",     
     port: 7545,            
     network_id: "5777",       
    }
```
#### Truffle Test in Development Mode  
`truffle test`

#### Truffle Test On Rinkeby
`truffle test --network rinkeby`
### Workflow
Goal: User can deposit and withdraw funds and receive an ERC20 token reward.
  1. User connects MetaMask wallet
  2. User deposits x ETH in their account
  3. User's balance is updated once transaction is mined 
  4. User is rewarded Galleon tokens for using the protocol

### Future Improvements
  5. Add a staking contract where users can provide ETH/GAL liquidity
  6. Add loading state while transactions are being mined (UI)
  7. Add price feed for ETH
  8. Allow users to earn more through Compound
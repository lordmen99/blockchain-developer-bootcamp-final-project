# Final Project Idea
## Gas Lottery
The goal of the Gas Lottery is to give Ethereum users a chance to make back some of the money they've spent on gas fees.  

The Gas Lottery is a betting game in which registered users can bet what the price of gas will be in GWEI at a specific time. 

Each user wagers the amount they are willing to bet and all wagers are pooled. The winner who correctly guess the gas price will receive 90%* of the reward pool with 10%* going towards paying gas to get the price data from the oracle. If multiple users correctly guess the gas price the reward pool will equally split amongst all parties.  

Winners will also be given the option to donate a portion of their winnings to the Gas Lottery community pool which will randomly select a user who hasn't won to receive a small donation.  

*Amounts may be adjusted depending on the gas estimation for oracle calls.
#### Workflow

  1. User connects their MetaMask wallet to register  
   ```
  function registerUser (address _user)  {
    // registers user 
  } 
   ``` 
  2. UI Displays the current balance of the lottery pool
   
   ```
  function getContractBalance (address _contract)  {
    /* get balance of the Contract account */
  } 
   ``` 
  3. UI displays a countdown to the next drawing
   
  ```
  function nextDraw ()  {
    /* countdown until next drawing time */
  }
  ``` 
  4. UI displays a countdown to the deadline to buy a ticket for the next drawing
   ```
  function countdownDeadline () {
    /* countdown to deadline to buy tickets for next drawing */
  }
  ``` 
  5. User places a bet by entering their gas price prediction and # of tickets to buy
  ```
  function buyLottoTicket (uint gasPrediction, uint ticketCount, ) {
    /* user enters their gas price prediction and the #
        of tickets they want to buy. Each ticket costs x ETH */
  }
  ``` 
  5. Wagered amount from user is calculated & added to the Lottery Pool
  ```
    function updateBalance (address contract, uint ticketCount) 
      /* balance += (ticketCount *= ticketCost) */
    }
  ``` 

  6. Contract gets gas price from Oracle for the time specified in the drawing
  ```  
    function getGasPrice (time) {
      /* get gas price for the given time */
    }
  ```
  7. Contract searches ticket submissions to select winners that guessed the correct price
   ``` 
   function selectWinners (price) {
     /* generate list of winners who submitted correct price prediction
   }
   ```
  8. Evenly distribute lottery pool to winner(s)
   ```
   function distributeWinnings(winners) {
     \* distribute winnings to distinct addresses in winner pool */
   }
   ```
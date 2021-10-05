# Final Project Idea

Category: Social Media
Inspiration: MySpace

#### Workflow

  1. User connects their MetaMask wallet to register  
   ```
    function registerUser (address _user)  {
        // registers user 
      } 
   ``` 
  2. User's NFTs are displayed in a gallery on their profile
   
   ```
    function getNftData (address _user)  {
        /* get off-chain data from oracle 
        to pass to UI */
      } 
   ``` 
  3. Users can add each other as friends
   
  ```
  function addFriend (address _user)  {
          /* add _user to Friends[] */
      }
  ``` 

  4. Users can offer and accept trades with friends
   ```
    function offerTrade (address _user, uint _give, uint _receive) 
      verifyFriend {
          /* offer to give tokenID of _give 
          in exchange for tokenID of _receive */
    }
  ``` 
  ```
    function acceptTrade (address _user, uint _receive, uint _give) 
      verifyFriend {
          /* send _give , receive _receive */
    }
  ``` 

  5. Users can send gifts to friends
```
    function giftFriend (address _user, uint _give) 
      verifyFriend {
          /* send _give to verified friend */
    }
  ``` 


#### Advanced Implementation (Reach Goal)
  7. User's timeline shows friend activity (ex. "Dinah just added Bad Kid #726 from the Bad Kids Alley collection to her gallery.)
  8. NFT ranking stats - leaderboard shows NFT likes total in descending order
  9. Users can bet on floor prices with friends. Winner gets the total amount wagered

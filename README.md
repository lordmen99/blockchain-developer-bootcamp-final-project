# Final Project Idea

Category: Gaming/Gambling
Inspiration: [Wheel of Fortune](https://www.youtube.com/watch?v=mx88JHgfink)

#### Workflow

  1. Player connects MetaMask wallet
  2. New Players receive `x` in-game tokens
  3. Player spins the wheel. `y` in-game tokens are deducted for each spin
  4. Wheel determines awards or deductions (like Wheel of Fortune)
  5. Player token balance is updated or decremented accordingly
  6. Player moves up or down the leaderboard based on in-game token balance
  7. If player runs out of in-game tokens player can buy more tokens with ETH (or maybe Polygon - need to learn more about L2)

#### Advanced Implementation (Reach Goal)

  1. Game randomly generates a hidden word or phrase related to blockchain  
  2. Player spins the wheel each turn to guess a letter (or player can choose to guess the entire answer).`y` in-game tokens are deducted for each spin
  3. Wheel determines awards *if the guess is correct* or deductions if it lands on a losing slice
  4. Player token balance is updated or decremented accordingly
  5. Player moves up or down the leaderboard based on in-game token balance
  6. If player runs out of in-game tokens player can buy more tokens with ETH (or maybe Polygon - need to learn more about L2)
  7. Game ends once the player correctly guesses the phrase or if the player runs out of tokens
  8. Player can click the phrase to learn more about the subject

#### The Wheel

- Awards (5 total)
  - Common: has token amounts listed (5-15 tokens)
  - Rare: has a blue chip NFT pic (like BAYC, Punks, ArtBlocks) worth 30 - 50 tokens

- Deductions (5 total)
  - Common: has negative token amount listed (minus 10-30 tokens)
  - Rare: Bankruptcy. Deducts entire token balance since game start (only 1 of these)

#### Concepts

- Metamask User Authentication
- Smart Contracts
- Responsibe Web Design
- Probability & Game Theory
- Blockchain Basics (the advanced implementation will also be a learning opportunity)

import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Web3 from 'web3';
import gringotts from './utils/Gringotts.json';
import galleons from './utils/Galleon.json';

const App = () => {
  // Replace localhost with Infura link once deployed to Rinkeby
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const address = "0x9cb6a8D017747b00c41Ec4A3293eF5a46b695240";
  const abi = gringotts.abi;
  const gringottsContract = new web3.eth.Contract(abi, address);

  const address2 = "0xe587F861ABbD4e60F634cF0790C28FFc77A7d3Fe"
  const abi2 = galleons.abi;
  const galleonsContract = new web3.eth.Contract(abi2, address2);


  const [currentAccount, setCurrentAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [depositValue, setDepositValue] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [count, setCount] = useState(0);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("You need a MetaMask wallet to connect.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]); 
      setConnected(true);

      const bal = await gringottsContract.methods.getBalance().call({from: accounts[0]});
      
      setBalance(web3.utils.fromWei(bal, 'ether'));

    } catch (error) {
      console.log(error)
    }
  }

  const makeDeposit = async () => {
    try{
      const amount = web3.utils.toWei(depositValue,'ether');
      await gringottsContract.methods.deposit().send( {from: currentAccount, value: amount, gasLimit: 300000} );

      const newBal = await gringottsContract.methods.getBalance().call({from: currentAccount});
      
      setBalance(web3.utils.fromWei(newBal, 'ether'));
      setDepositValue(0);
      setCount(count+1);

    } catch(error) {
      console.log(error);
    }
  }

  const makeWithdrawal = async () => { 
    try {
      const amount = web3.utils.toWei(withdrawValue,'ether');
      const bal = await gringottsContract.methods.getBalance().call({from: currentAccount});
      
      (bal > amount) ? await gringottsContract.methods.withdraw(amount).send({from: currentAccount})
        : alert("insufficient funds");

      const newBal = await gringottsContract.methods.getBalance().call({from: currentAccount});
      setBalance(web3.utils.fromWei(newBal, 'ether'));
      setWithdrawValue(0);
      setCount(0);
    }catch(error) {
      console.log(error);
    }  
  }

  const claim = async () => {
    try {

      await galleonsContract.methods.increaseAllowance(address, 1000000000).encodeABI();
  
      await galleonsContract.methods.transfer(address, 1000).send({from: currentAccount});
      
      let bankGalleonBalance = await galleonsContract.methods.balanceOf(address).call()
      .then( function (bal) {
          return bal
        });
      
      console.log(`Tokens allocated to bank ${bankGalleonBalance}`);

      await gringottsContract.methods.mintGalleonsToUser(currentAccount);
      
      let userGalleonBalance = await galleonsContract.methods.balanceOf(currentAccount).call().then(function (bal){
        return bal});
      
      console.log(`Tokens allocated to user ${userGalleonBalance}`);
      setRewards(userGalleonBalance);

    }catch(error) {
      console.log(error);
    }
  }




  return (
    <Container className="p-3">
      <Container >
        <Row className="justify-content-sm-center mb-5">
          <Col sm={8}></Col>
            <Col sm={4}>
              <Button bg-primary="true" onClick={connectWallet}>{currentAccount ? `${currentAccount}` : "Connect Wallet"}</Button>
            </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card className="p-2 m-auto mb-5 text-center" border="primary" style={{ width: '28rem' }}>
              <Card.Body>Balance: {balance} ETH</Card.Body>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount (ETH)"
                  aria-label="Amount (ETH)"
                  aria-describedby="basic-addon2"
                  value={depositValue}
                  onChange={e => setDepositValue(e.target.value)}
                />
                <Button 
                  variant="outline-primary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }} 
                  onClick={makeDeposit}
                  disabled={!connected}
                >
                  Deposit
                </Button>
              </InputGroup>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount (ETH)"
                  aria-label="Amount (ETH)"
                  aria-describedby="basic-addon2"
                  value={withdrawValue}
                  onChange={e => setWithdrawValue(e.target.value)}/>
                <Button 
                  variant="outline-secondary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }}
                  disabled={!(balance > 0)}
                  onClick={makeWithdrawal}
                >
                  Withdraw
                </Button>
              </InputGroup>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col sm={12}>
            <Card className="p-2 m-auto mb-5 text-center" border="primary" style={{ width: '28rem' }}>
              <Card.Body>Balance: {rewards} Galleons</Card.Body>
                <Button 
                  variant="primary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }}
                  disabled={!(count > 0)}
                  onClick={claim}
                >
                  Claim Rewards
                </Button>
            </Card>
          </Col>
        </Row>
      </Container>
  </Container>
  );
}

export default App;
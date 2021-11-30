import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Web3 from 'web3';
import gringotts from './abis/Gringotts.json';
import galleons from './abis/Galleon.json';

import metamask from './images/metamask.png';
import eth from './images/eth.png';
import galleon from './images/galleon.png';

const App = () => {
  // Replace localhost with Infura link once deployed to Rinkeby
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const gringottsAddress = "0x2C1237aA3433932ec7bd5CeceAc8E2F0fD150741";
  const gringottsABI = gringotts.abi;
  const gringottsContract = new web3.eth.Contract(gringottsABI, gringottsAddress);

  const galleonAddress = "0xA3F4e325eAD9Fe1f9D5FCCd3A33A1deEf18D4d71";
  const galleonABI = galleons.abi;
  const galleonsContract = new web3.eth.Contract(galleonABI, galleonAddress);

  const [currentAccount, setCurrentAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const [rewards, setRewards] = useState(0);
  const [available, setAvailable] = useState(false);

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

      const ethBalance = await gringottsContract.methods.getWeiBalance().call( { from: accounts[0] } );
      setBalance(web3.utils.fromWei(ethBalance, 'ether'));

      const userGalleonBalance = await galleonsContract.methods.balanceOf(accounts[0]).call().then((bal) =>bal); 
      setRewards(web3.utils.fromWei(userGalleonBalance, 'ether'));

    } catch (error) {
      console.log(error);
    }
  }

  const makeDeposit = async () => {
    try{
      const amount = web3.utils.toWei(depositValue,'ether');
      await gringottsContract.methods.deposit().send( { from: currentAccount, value: amount, gasLimit: 300000 } );

      const ethBalance = await gringottsContract.methods.getWeiBalance().call( { from: currentAccount } );
      
      setBalance( web3.utils.fromWei(ethBalance, 'ether') );
      setDepositValue('');
      setAvailable(true);

    } catch(error) {
      console.log(error);
    }
  }

  const makeWithdrawal = async () => { 
    try {
      const amount = web3.utils.toWei(withdrawValue,'ether');
      const bal = await gringottsContract.methods.getWeiBalance().call({from: currentAccount});
      
      (bal > amount) ? await gringottsContract.methods.withdraw(amount).send({from: currentAccount})
        : alert("insufficient funds");

      const newBal = await gringottsContract.methods.getWeiBalance().call({from: currentAccount});
      setBalance(web3.utils.fromWei(newBal, 'ether'));

      setWithdrawValue('');

    }catch(error) {

      console.log(error);

    }  
  }

  const claim = async () => {
    try {
      let userGalleonBalance = await galleonsContract.methods.balanceOf(currentAccount).call().then((bal) =>bal);
      userGalleonBalance = web3.utils.fromWei(userGalleonBalance.toString(), 'ether');

      if (parseInt(userGalleonBalance) >= 1000) {
        alert('User has already claimed their rewards for this year');
        setAvailable(false);
        return;
      } 
      else {
        await gringottsContract.methods.mintGalleonsToUser(currentAccount).send( { from: currentAccount });
        userGalleonBalance = await galleonsContract.methods.balanceOf(currentAccount).call().then((bal) => bal);
        setRewards(web3.utils.fromWei(userGalleonBalance, 'ether'));
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <Container className="p-3">
      <Container >
        <Row className="justify-content-sm-end mb-5">
          <Col sm={{ span: 6, offset: 3 }}></Col>
            <Col sm={{ span: 3, offset: 2 }}>
              <Button bg-primary="true" style={{ width: '12rem' }}
              onClick={ connectWallet }> <img src={metamask} height='32' alt="Metamask Logo"/>{ currentAccount ? 
              ` ${currentAccount.slice(0, 6)}......${currentAccount.slice(currentAccount.length - 4, currentAccount.length)}` 
              : " Connect Wallet" }
              
              </Button>
            </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card className="m-auto mb-5 text-center" border="primary" style={{ width: '28rem' }}>
            <Card.Header>Account Balance</Card.Header>
              <Card.Body>{ balance } ETH <img src={eth} height='32' alt="Ether Logo"/></Card.Body>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount (ETH)"
                  aria-label="Amount (ETH)"
                  aria-describedby="basic-addon2"
                  value={ depositValue }
                  onChange={ e => setDepositValue(e.target.value) }
                />
                <Button 
                  variant="outline-primary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }} 
                  onClick={ makeDeposit }
                  disabled={ !connected }
                >
                  Deposit
                </Button>
              </InputGroup>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount (ETH)"
                  aria-label="Amount (ETH)"
                  aria-describedby="basic-addon2"
                  value={ withdrawValue }
                  onChange={ e => setWithdrawValue(e.target.value) }/>
                <Button 
                  variant="outline-secondary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }}
                  disabled={!(balance > 0)}
                  onClick={ makeWithdrawal }
                >
                  Withdraw
                </Button>
              </InputGroup>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col sm={12}>
            <Card className="m-auto mb-5 text-center" border="primary" style={{ width: '28rem' }}>
              <Card.Header>Claimed Rewards</Card.Header>
              <Card.Body>
                <Card.Text>{ rewards } Galleons <img src={galleon} height='32' alt="Ether Logo"/></Card.Text>
                <Button className="mb-3"
                  variant="primary" 
                  id="button-addon2" 
                  style={{ width: '6rem' }}
                  disabled={!(available)}
                  onClick={ claim }
                >
                  { available ? 'Claim Rewards' : 'Claimed' }
                </Button>
              </Card.Body>
            </Card> 
          </Col>
        </Row>
      </Container>
  </Container>
  );
}

export default App;
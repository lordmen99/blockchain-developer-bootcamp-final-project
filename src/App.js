import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import Loader from "react-loader-spinner";

import Web3 from 'web3';
import gringotts from './abis/Gringotts.json';
import galleons from './abis/Galleon.json';

import metamask from './images/metamask.png';
import eth from './images/eth.png';
import galleon from './images/galleon.png';
import logo from './images/logo.png';

const App = () => {

  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const expectedBlockTime = 1000; 
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const gringottsAddress = "0x36095798B6cc9eD99Bd28c5B4250A37E3e1eFAa5";
  const gringottsABI = gringotts.abi;
  const gringottsContract = new web3.eth.Contract(gringottsABI, gringottsAddress);

  const galleonAddress = "0x580631591d98f8BBE4e81811CfFA0443eD251DA6";
  const galleonABI = galleons.abi;
  const galleonsContract = new web3.eth.Contract(galleonABI, galleonAddress);

  const [currentAccount, setCurrentAccount] = useState('');
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const [rewards, setRewards] = useState(0);
  const [available, setAvailable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPending, setPending] = useState(false);

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
      let ethBalance;
      const amount = web3.utils.toWei(depositValue,'ether');
      await gringottsContract.methods.deposit().send( { from: currentAccount, value: amount.toString(), gasLimit: 300000 }, async function(error, transactonHash) {
        console.log("Submitted transaction with hash: ", transactonHash)
        let transactionReceipt = null
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
          transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
          setLoading(true)
          await sleep(expectedBlockTime)
        }
        console.log("Transaction receipt: ", transactionReceipt)
        ethBalance = await gringottsContract.methods.getWeiBalance().call( { from: currentAccount } );
        setBalance( web3.utils.fromWei(ethBalance, 'ether') );
        setDepositValue('');
        setAvailable(true);
        setLoading();
      });
    } catch(error) {
      console.log(error);
    }
  }

  const makeWithdrawal = async () => { 
    try {
      const amount = web3.utils.toWei(withdrawValue,'ether');
      let bal = await gringottsContract.methods.getWeiBalance().call({from: currentAccount});
      
      if (bal < amount) {
        alert("insufficient funds");
        setWithdrawValue('');
      } else {
        await gringottsContract.methods.withdraw(amount).send({from: currentAccount}, async function(error, transactonHash) {
          console.log("Submitted transaction with hash: ", transactonHash)
          let transactionReceipt = null
          while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
            transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
            setLoading(true)
            await sleep(expectedBlockTime)
          }
          console.log("Transaction receipt: ", transactionReceipt)
          bal = await gringottsContract.methods.getWeiBalance().call( { from: currentAccount } );
          setBalance( web3.utils.fromWei(bal, 'ether') );
          setWithdrawValue('');
          setLoading();
        });
      }
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
        await gringottsContract.methods.mintGalleonsToUser(currentAccount).send( { from: currentAccount }, async function(error, transactonHash) {
          console.log("Submitted transaction with hash: ", transactonHash)
          let transactionReceipt = null
          while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
            transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
            setPending(true)
            await sleep(expectedBlockTime)
          }
          console.log("Transaction receipt: ", transactionReceipt)
          userGalleonBalance = await galleonsContract.methods.balanceOf(currentAccount).call().then((bal) => bal);
          setRewards(web3.utils.fromWei(userGalleonBalance, 'ether'));
          setPending();
        });
        
      }
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <Container className="p-3">
      <Container >
        <Row className="align-items-sm-center mb-5">
          <Col sm={{ span: 6}}>
            <Navbar>
              <Container>
                <Navbar.Brand href="#home">
                  <span id="title">Gringotts Bank</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          </Col>
            <Col sm={{ span: 3, offset: 3 }}>
              <Button id="connectBtn" style={{ width: '14rem' }}
              onClick={ connectWallet }> <img src={metamask} height='32' alt="Metamask Logo"/>{ currentAccount ? 
              ` ${currentAccount.slice(0, 6)}......${currentAccount.slice(currentAccount.length - 4, currentAccount.length)}` 
              : " Connect to Rinkeby" }
              </Button>
            </Col>
        </Row>
        <Row className="justify-content-sm-center mb-3 text-center">
          <Col sm={{ span: 6}}>
            <span id="description">To make deposits and withdrawals, 
            please connect your Metamask Wallet to the Rinkeby network. You
            will need some test ETH as well. Try the official <a href="https://faucet.rinkeby.io/">Rinkeby Faucet</a>.</span>
          </Col>
        </Row>
        <Row className="justify-content-sm-center">
          <Col sm={12}>
              {isLoading 
              ? <Card className="m-auto mb-3 text-center p-3" style={{ width: '32rem' }}>
                  <Loader
                      type="Oval"
                      color="#734b6d"
                      height={80}
                      width={80}
                      timeout={15000} //3 secs
                    />
                </Card>
              : 
              <Card
                className="m-auto mb-3 text-center p-3" 
                style={{ width: '32rem' }}
                text="light"
              >
                <Card.Header><Card.Title>Account Balance</Card.Title></Card.Header>
                  <Card.Body>{ balance } ETH <img src={eth} height='32' alt="Ether Logo"/></Card.Body>
                    <InputGroup className="mb-2 p-2">
                      <FormControl
                        placeholder="Amount (ETH)"
                        aria-label="Amount (ETH)"
                        aria-describedby="basic-addon2"
                        value={ depositValue }
                        onChange={ e => setDepositValue(e.target.value) }
                      />
                      <Button 
                        id="primary" 
                        style={{ width: '8rem' }} 
                        onClick={ makeDeposit }
                        disabled={ !connected }
                      >
                        Deposit
                      </Button>
                    </InputGroup>
                    <InputGroup className="mb-2 p-2">
                      <FormControl
                        placeholder="Amount (ETH)"
                        aria-label="Amount (ETH)"
                        aria-describedby="basic-addon2"
                        value={ withdrawValue }
                        onChange={ e => setWithdrawValue(e.target.value) }/>
                      <Button 
                        variant="dark"
                        id="button-addon2" 
                        style={{ width: '8rem' }}
                        disabled={!(balance > 0)}
                        onClick={ makeWithdrawal }
                      >
                        Withdraw
                      </Button>
                    </InputGroup>
              </Card>
            }
          </Col>
        </Row>
        <Row className="justify-content-sm-center">
        <Col sm={12}>
            { isPending 
              ? <Card 
                  className="m-auto mb-2 text-center  p-3" 
                  style={{ width: '32rem' }}
                  text="light"
                >
                  <Loader
                    type="Oval"
                    color="#734b6d"
                    height={80}
                    width={80}
                    timeout={18000} //3 secs
                  />
                </Card>
              : <Card 
                  className="m-auto mb-3 text-center  p-3" 
                  style={{ width: '32rem' }}
                  text="light"
                >
                  <Card.Header><Card.Title>Rewards</Card.Title></Card.Header>
                  <Card.Body>
                    <Card.Text>{ rewards } Galleons <img src={galleon} height='32' alt="Galleons Logo"/></Card.Text> 
                    <Button className="mb-3" id="primary"
                        id="button-addon2" 
                        size="lg"
                        disabled={!(available)}
                        onClick={ claim }
                      > 
                    { (!available && rewards === 0 ) ? 'Deposit to Earn Rewards' 
                      : (!available && rewards === '1000' ) ? 'Claimed'
                      : 'Claim Rewards'
                    }
                  </Button>
                  </Card.Body>
                </Card> 
            }
          </Col>
          </Row>
      </Container>
      <div id="notice">
        <p>To display $GAL in MetaMask open the extension and go to the Assets tab. Select import token then copy and paste the GAL token address:</p>
        <p>0x580631591d98f8BBE4e81811CfFA0443eD251DA6</p>
      </div>
  </Container>
  );
}

export default App;
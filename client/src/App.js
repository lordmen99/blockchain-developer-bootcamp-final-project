import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {
  return (
    <Container className="p-3">
      <Container >
        <Row className="justify-content-sm-center mb-5">
          <Col sm={8}></Col>
          <Col sm={4}>
            <Button bg-primary="true">Connect Wallet</Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card className="p-2 m-auto mb-5 text-center" border="primary" style={{ width: '28rem' }}>
              <Card.Body>Balance</Card.Body>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount"
                  aria-label="Amount"
                  aria-describedby="basic-addon2"
                />
                <Button variant="outline-primary" id="button-addon2" style={{ width: '6rem' }}>
                  Deposit
                </Button>
              </InputGroup>
              <InputGroup className="mb-3 p-2">
                <FormControl
                  placeholder="Amount"
                  aria-label="Amount"
                  aria-describedby="basic-addon2"
                />
                <Button variant="outline-secondary" id="button-addon2" style={{ width: '6rem' }}>
                  Withdraw
                </Button>
              </InputGroup>
            </Card>
          </Col>
        </Row>
      </Container>
  </Container>
  );
}

export default App;
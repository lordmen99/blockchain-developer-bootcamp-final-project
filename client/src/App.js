import React, { useState } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function App() {
  return (
   
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <Card border="primary" style={{ width: '20rem' }}>
          <Card.Body>Balance</Card.Body>
          <InputGroup className="mb-3">
            <FormControl aria-label="Text input with dropdown button" />
              <DropdownButton
                variant="outline-secondary"
                title="Select"
                id="input-group-dropdown-2"
                align="end"
              >
                <Dropdown.Item href="#">Deposit</Dropdown.Item>
                <Dropdown.Item href="#">Withdraw</Dropdown.Item>
              </DropdownButton>
          </InputGroup>
        </Card>  
      </Container>
  </Container>
   
  );
}

export default App;

import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
//import '../styles/Header.css';

const Header = () => {

  return (
    <Navbar bg="light" expand="lg" className="header">
      <Navbar.Brand href="#">
        <img
          src="../images/logo.png"
          alt="Citybike Logo"
          className="logo-image"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
        <Image src="../images/logo.png" thumbnail />
        CITYBIKE
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto auth-buttons">
          <Button variant="outline-primary" className="mr-2">Regístrate</Button>
          <Button variant="outline-secondary">Login</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

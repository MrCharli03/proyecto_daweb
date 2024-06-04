import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
//import '../styles/Header.css';
import ImageLogo from '../images/logo.png'

const Header = () => {

  return (
    <Navbar bg="light" expand="lg" className="header">
      <Navbar.Brand href="#">
        <Image style={{ marginLeft: '10px' }} src={ImageLogo} roundedCircle height={50} width={50} />
        <span style={{ marginLeft: '10px' }}>CityBike</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="auth-buttons">
          <Button style={{ marginRight: '10px' }} variant="outline-primary" className="mr-2">Regístrate</Button>
          <Button href="/login" style={{ marginRight: '10px' }} variant="outline-secondary">Login</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

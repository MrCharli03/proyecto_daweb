import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import ImageLogo from '../images/logo.png';

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
          <Link to="/register" className="btn btn-outline-primary" style={{ marginRight: '10px' }}>Regístrate</Link>
          <Link to="/auth/login" className="btn btn-outline-secondary" style={{ marginRight: '10px' }}>Login</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

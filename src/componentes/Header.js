import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import ImageLogo from '../images/logo.png';
import '../styles/Header.css';

const Header = () => {
  return (
    <Navbar expand="lg" className="header">
      <Navbar.Brand href="#">
        <Image style={{ marginLeft: '10px' }} src={ImageLogo} roundedCircle className="logo-image"/>
        <span style={{ marginLeft: '10px' }} className='logo-font'>CityBike</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="auth-buttons">
          <Link to="/register" className="btn btn-secondary">Regístrate</Link>
          <Link to="/auth/login" className="btn btn-dark" style={{ marginRight: '70px' }}>Inicar Sesión</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

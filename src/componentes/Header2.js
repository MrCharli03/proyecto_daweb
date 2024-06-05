import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import ImageLogo from '../images/logo.png';
import '../styles/Header.css';

const Header2 = () => {
  const [isGestor, setIsGestor] = useState(false);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'Gestor') {
      setIsGestor(true);
    }
  }, []);

  return (
    <Navbar expand="lg" className={`header ${isGestor ? 'header-gestor' : ''}`}>
      <Navbar.Brand href="#">
        <Image style={{ marginLeft: '10px' }} src={ImageLogo} roundedCircle className="logo-image"/>
        <span style={{ marginLeft: '10px' }} className='logo-font'>CityBike</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="auth-buttons">
          <Link to="/" className="btn btn-dark" style={{ marginRight: '70px' }}>Logout</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header2;
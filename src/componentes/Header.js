import React from 'react';
import '../styles/Header.css';
import citibykeLogo from '../images/logo.png'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={citibykeLogo} alt="Citybike Logo" className="logo-image" />
        CITYBIKE
      </div>
      <div className="auth-buttons">
        <button>Regístrate</button>
        <button>Login</button>
      </div>
    </header>
  );
}

export default Header;

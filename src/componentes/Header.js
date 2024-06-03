import React from 'react';
import '../styles/Header.css';

const Header = () => {
  console.log('Ruta de la imagen:', "../images/logo.png");

  return (
    <header className="header">
      <div className="logo">
        <img src="../images/logo.png" alt="Citybike Logo" className="logo-image" />
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

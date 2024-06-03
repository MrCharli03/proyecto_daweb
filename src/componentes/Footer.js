import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="links">
        <div>Citybike</div>
        <div>Mapa del sitio</div>
      </div>
      <div className="community">
        <div>Comunidad</div>
        <div>Eco ciudad</div>
      </div>
      <div className="contacts">
        <div>Nuestros contactos:</div>
        <div>citybike...@email</div>
        <div>Tel: ...</div>
      </div>
      <div className="language">
        <div>Idioma:</div>
        <select>
          <option>Español</option>
          <option>Inglés</option>
          <option>Francés</option>
        </select>
      </div>
    </footer>
  );
}

export default Footer;

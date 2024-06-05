import React from 'react';
import Header2 from '../componentes/Header2';
import Footer from '../componentes/Footer';
import '../styles/PaginaPresentacion.css';
import Saludo from '../componentes/Saludo';

const PaginaSaludo = () => {
    return (
        <div className="main-container">
            <Header2 />
            <Saludo />
            <Footer />
        </div>
    );
}

export default PaginaSaludo;
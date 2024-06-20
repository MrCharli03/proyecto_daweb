import React from 'react';
import Header from '../componentes/Header';
import MainContent from '../componentes/MainContent';
import Footer from '../componentes/Footer';
import '../styles/PaginaPresentacion.css';

const PaginaPresentacion = () => {
    return (
        <div className="main-container">
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
}

export default PaginaPresentacion;

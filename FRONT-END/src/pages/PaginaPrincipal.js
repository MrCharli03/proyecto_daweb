import React from 'react';
import Header2 from '../componentes/Header2';
import Principal from '../componentes/Principal';
import Footer from '../componentes/Footer';

const PaginaPrincipal = () => {
    return (
        <div className="main-container">
            <Header2 />
            <Principal />
            <Footer />
        </div>
    );
}

export default PaginaPrincipal;
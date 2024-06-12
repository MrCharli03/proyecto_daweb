import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Estaciones from './Estaciones';
import Bicis from './Bicis';
import '../styles/Principal.css';

const Principal = () => {
    const userRole = sessionStorage.getItem('userRole');
    const [activeKey, setActiveKey] = useState('estaciones');

    const handleSelect = (key) => {
        setActiveKey(key);
    };

    return (
        <div className='tabs-container'>
            <Tabs
                activeKey={activeKey}
                onSelect={handleSelect}
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="estaciones" title="Estaciones">
                    {activeKey === 'estaciones' && <Estaciones />}
                </Tab>
                <Tab eventKey="reservasAlquileres" title="Reservas y Alquileres">
                    Reservas y Alquileres
                </Tab>
                <Tab eventKey="activo" title="Activo">
                    Reserva/Alquiler activo
                </Tab>
                {userRole === 'Gestor' && (
                    <Tab eventKey="bicis" title="Bicis">
                        {activeKey === 'bicis' && <Bicis />}
                    </Tab>
                )}
            </Tabs>
        </div>
    );
};

export default Principal;
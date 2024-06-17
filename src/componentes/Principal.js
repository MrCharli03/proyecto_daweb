import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Estaciones from './Estaciones';
import Bicis from './Bicis';
import Reservas from './Reservas';
import Alquileres from './Alquileres';
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
                id="justify-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="estaciones" title="Estaciones">
                    {activeKey === 'estaciones' && <Estaciones />}
                </Tab>
                <Tab eventKey="reservas" title="Reservas">
                    {activeKey === 'reservas' && <Reservas />}
                </Tab>
                <Tab eventKey="alquileres" title="Alquileres">
                    {activeKey === 'alquileres' && <Alquileres />}
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

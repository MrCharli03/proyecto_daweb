import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Estaciones from './Estaciones';
import '../styles/Principal.css';

const Principal = () => {
    return (
        <div className='tabs-container'>
            <Tabs
                defaultActiveKey="estaciones"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="estaciones" title="Estaciones">
                    <Estaciones />
                </Tab>
                <Tab eventKey="reservasAlquileres" title="Reservas y Alquileres">
                    Reservas y Alquileres
                </Tab>
                <Tab eventKey="activo" title="Activo">
                    Reserva/Alquiler activo
                </Tab>
            </Tabs>

        </div>
    );
}

export default Principal;
import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { MdCleaningServices } from 'react-icons/md';
import { BsPlusCircleFill } from 'react-icons/bs';
import '../styles/SearchBar.css';

const SearchBar = ({ buscarTermino, setBuscarTermino, fetchEstaciones, limpiarBusqueda, userRole, handleAddEstacion }) => (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1%' }}>
        <InputGroup style={{ flex: '1', marginRight: '1%' }}>
            <Button variant='dark' onClick={() => fetchEstaciones()}><FaSearch /></Button>
            <Form.Control
                placeholder="Buscar por nombre, código postal o nº de puestos"
                type="text"
                value={buscarTermino}
                onChange={(e) => setBuscarTermino(e.target.value)}
                style={{ textAlign: 'left', borderRadius: '0', flexGrow: '1' }}
            />
        </InputGroup>
        <Button variant='info' onClick={limpiarBusqueda} style={{ marginRight: '1%' }} className="clear-button">
            <MdCleaningServices /> <span>Limpiar búsqueda</span>
        </Button>
        {userRole === 'Gestor' && (
            <Button className='custom-button' onClick={handleAddEstacion}>
                <BsPlusCircleFill /> <span style={{ marginLeft: '5px' }}>Agregar Estación</span>
            </Button>
        )}
    </div>
);

export default SearchBar;

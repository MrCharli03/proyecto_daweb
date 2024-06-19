import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { MdCleaningServices } from 'react-icons/md';
import { BsPlusCircleFill } from 'react-icons/bs';

const SearchBar = ({ buscarNombre, setBuscarNombre, buscarCodPostal, setBuscarCodPostal, buscarNumPuestos, setBuscarNumPuestos, fetchEstaciones, limpiarBusqueda, userRole, handleAddEstacion }) => (
    <InputGroup>
        <Button variant='dark' style={{ marginLeft: '8%', alignSelf: 'flex-start' }} onClick={() => fetchEstaciones()}><FaSearch /></Button>
        <Form.Group>
            <Form.Control
                placeholder="Nombre"
                type="text"
                value={buscarNombre}
                onChange={(e) => setBuscarNombre(e.target.value)}
                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '300px', borderRadius: '0' }}
            />
        </Form.Group>
        <Form.Group>
            <Form.Control
                placeholder="Código Postal"
                type="text"
                value={buscarCodPostal}
                onChange={(e) => setBuscarCodPostal(e.target.value)}
                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '150px', borderRadius: '0' }}
            />
        </Form.Group>
        <Form.Group>
            <Form.Control
                placeholder="Número de puestos"
                type="number"
                className='no-spinner'
                value={buscarNumPuestos}
                onChange={(e) => setBuscarNumPuestos(e.target.value)}
                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '170px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
            />
        </Form.Group>
        <div style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '1%', alignSelf: 'flex-start' }}>
            <Button variant='info' onClick={limpiarBusqueda}>
                <MdCleaningServices /> Limpiar busqueda
            </Button>
        </div>
        {userRole === 'Gestor' && (
            <div style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '1%', alignSelf: 'flex-start' }}>
                <Button className='custom-button' onClick={handleAddEstacion}>
                    <BsPlusCircleFill /> Agregar Estación
                </Button>
            </div>
        )}
    </InputGroup>
);

export default SearchBar;

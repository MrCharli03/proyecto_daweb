import React from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { BiSolidDislike } from 'react-icons/bi';
import { FaCalendarCheck, FaKey } from 'react-icons/fa';

const BiciTable = ({ bicicletasEstacion, userRole, handlePrevioBajaBici, handleReservar, handleAlquiler }) => (
    <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '70%', padding: '0' }}>
        {bicicletasEstacion.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                Esta estacion no tiene bicis
                <br />
                <br />
            </div>
        ) : (
            <Table striped bordered hover variant="dark" className="table-container">
                <thead className='sticky-header'>
                    <tr>
                        <th>Modelo</th>
                        <th>Fecha de Alta</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {bicicletasEstacion.map(bici => (
                        <tr key={bici._id}>
                            <td>{bici.modelo}</td>
                            <td>{new Date(bici.fechaAlta).toLocaleDateString()}</td>
                            <td className={
                                bici.estado === 'DISPONIBLE' ? 'verde' :
                                    bici.estado === 'RESERVADA' ? 'naranja' :
                                        'rojo'
                            }>{bici.estado}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                                    {userRole === 'Gestor' && (
                                        <Button variant="danger" style={{ borderRadius: '50%' }} title="Dar de Baja" onClick={() => handlePrevioBajaBici(bici.id)}>
                                            <BiSolidDislike />
                                        </Button>
                                    )}
                                    {bici.estado === 'DISPONIBLE' && (
                                        <>
                                            <Button className='custom-button' style={{ borderRadius: '50%' }} title="Reservar" onClick={() => handleReservar(bici.id)}>
                                                <FaCalendarCheck />
                                            </Button>
                                            <Button className='custom-button' style={{ borderRadius: '50%' }} title="Alquilar" onClick={() => handleAlquiler(bici.id)}>
                                                <FaKey />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </Container>
);

export default BiciTable;

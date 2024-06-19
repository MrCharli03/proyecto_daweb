import React from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';

const EstacionTable = ({ estaciones, userRole, handleModificar, confirmEliminar, verBicicletasEstacion }) => (
    <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '85%', padding: '0' }}>
        <Table striped bordered hover variant="dark" className='table-container'>
            <thead className="sticky-header">
                <tr>
                    <th>Nombre</th>
                    <th>Bicicletas</th>
                    <th>Puestos libres</th>
                    <th>Código Postal</th>
                    <th>Google Maps</th>
                    <th>Fecha de Alta</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {estaciones.map(estacion => (
                    <tr key={estacion.id}>
                        <td style={{ width: '25%', wordWrap: 'break-word', whiteSpace: 'normal' }}>{estacion.nombre}</td>
                        <td style={{ width: '20%', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            <ul>
                                {estacion.bicis.map(bici => (
                                    <li key={bici.id}>{bici.modelo}</li>
                                ))}
                            </ul>
                        </td>
                        <td style={{ width: '10%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{estacion.numPuestos}</td>
                        <td style={{ width: '10%', wordWrap: 'break-word', whiteSpace: 'normal' }}>{estacion.codPostal}</td>
                        <td style={{ width: '10%', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            <a href={`https://www.google.es/maps?q=${estacion.lat},${estacion.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: "lightblue", textDecoration: 'underline' }}>
                                Enlace
                            </a>
                        </td>
                        <td style={{ width: '10%', wordWrap: 'break-word', whiteSpace: 'normal' }}>{new Date(estacion.fechaAlta).toLocaleDateString()}</td>
                        <td style={{ maxWidth: '15%', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                            <div>
                                {userRole === 'Gestor' && (
                                    <>
                                        <Button variant="primary" style={{ marginRight: '10px', borderRadius: '50%' }} onClick={() => handleModificar(estacion.id)} title="Modificar">
                                            <BsFillPencilFill />
                                        </Button>
                                        <Button variant="danger" style={{ marginRight: '10px', borderRadius: '50%' }} onClick={() => confirmEliminar(estacion.id)} title="Eliminar">
                                            <FaTrash />
                                        </Button>
                                    </>
                                )}
                                <Button className='custom-button' style={{ borderRadius: '50%' }} onClick={() => verBicicletasEstacion(estacion.id, estacion.nombre)} title="Gestionar Bicis">
                                    <MdDirectionsBike size={18} />
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </Container>
);

export default EstacionTable;

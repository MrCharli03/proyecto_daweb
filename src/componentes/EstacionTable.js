import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';

const EstacionCard = ({ estaciones, userRole, handleModificar, confirmEliminar, verBicicletasEstacion }) => (
    <Container fluid className="card-container" style={{ width: '100%' }}>
        <Row>
            {estaciones.map(estacion => (
                <Col key={estacion.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                    <Card bg="dark" text="white" className="h-100">
                        <Card.Body>
                            <Card.Title>{estacion.nombre}</Card.Title>
                            <Card.Text>Código Postal: {estacion.codPostal}</Card.Text>
                            <Card.Text>
                                <strong>Puestos libres:</strong> {estacion.numPuestos}
                            </Card.Text>
                            <Card.Text>
                                <a href={`https://www.google.es/maps?q=${estacion.lat},${estacion.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: "lightblue", textDecoration: 'underline' }}>
                                    Ver en Google Maps
                                </a>
                            </Card.Text>
                            <Card.Text>
                                <small>Fecha de Alta: {new Date(estacion.fechaAlta).toLocaleDateString()}</small>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
);

export default EstacionCard;

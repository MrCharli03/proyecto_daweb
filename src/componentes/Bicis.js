import React, { useState, useEffect, useCallback } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import ErrorModal from './ErrorModal';

const Bicis = () => {
    const [bicicletas, setBicicletas] = useState([]);
    const [estaciones, setEstaciones] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const fetchBicis = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/estaciones/bicicletas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar la solicitud.');
            }

            const data = await response.json();
            setBicicletas(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las bicis');
            setShowErrorDialog(true);
        }
    }, []);

    const fetchEstaciones = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/estaciones/listado?nombre=&codPostal=&numPuestos=&page=0&size=-1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar la solicitud.');
            }

            const data = await response.json();
            if (data.hasOwnProperty('_embedded')) {
                const estacionesList = data._embedded.estacionDTOList;
                setEstaciones(estacionesList);
            } else {
                setError('No se encontró nada');
                setShowErrorDialog(true);
            }

        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    }, []);

    useEffect(() => {
        fetchBicis();
        fetchEstaciones();
    }, [fetchBicis, fetchEstaciones]);

    const getEstacionNombre = (estacionID) => {
        const estacion = estaciones.find(estacion => estacion.id === estacionID);
        return estacion ? estacion.nombre : 'Desconocido';
    };

    const getEstacionLat = (estacionID) => {
        const estacion = estaciones.find(estacion => estacion.id === estacionID);
        return estacion ? estacion.lat : 'Desconocido';
    };

    const getEstacionLng = (estacionID) => {
        const estacion = estaciones.find(estacion => estacion.id === estacionID);
        return estacion ? estacion.lng : 'Desconocido';
    };

    return (
        <div className="tab-contenedor">
            <h2>Bicis</h2>
            <br />
            <Container fluid className="card-container">
                {bicicletas.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        No hay bicicletas disponibles
                    </div>
                ) : (
                    <Row>
                        {bicicletas.map(bici => (
                            <Col key={bici.id} md={6} lg={4} className="mb-4">
                                <Card className="h-100" style={{
                                    backgroundColor: 
                                        bici.estado === 'DISPONIBLE' ? 'var(--olive)' :
                                        bici.estado === 'RESERVADA' ? 'rgb(209, 82, 41)' :
                                        '#DC143C',
                                    color: 'white'
                                }}>
                                    <Card.Body>
                                        <Card.Title>{bici.modelo}</Card.Title>
                                        <Card.Text>
                                            <strong>Fecha de Alta:</strong> {new Date(bici.fechaAlta).toLocaleDateString()}<br />
                                            <strong>Fecha de Baja:</strong> {bici.fechaBaja ? new Date(bici.fechaBaja).toLocaleDateString() : '-'}<br />
                                            <strong>Motivo:</strong> {bici.motivo || '-'}<br />
                                            <strong>Estado:</strong> {bici.estado}<br />
                                            <strong>Estacion:</strong> {bici.estacionID !== null ? (
                                                <a href={`https://www.google.es/maps?q=${getEstacionLat(bici.estacionID)},${getEstacionLng(bici.estacionID)}`} target="_blank" rel="noopener noreferrer" style={{ color: "lightblue", textDecoration: 'underline' }}>
                                                    {getEstacionNombre(bici.estacionID)}
                                                </a>
                                            ) : '-'}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            <ErrorModal
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                errorMessage={error}
            />
        </div>
    );
};

export default Bicis;

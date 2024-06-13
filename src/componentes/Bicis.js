import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Container } from 'react-bootstrap';

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

    const ErrorModal = ({ show, onClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className="bg-danger text-white justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-danger text-white" style={{ textAlign: 'center' }}>{errorMessage}</Modal.Body>
                <Modal.Footer className="bg-danger text-white justify-content-center">
                    <Button variant="dark" onClick={onClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="tab-contenedor">
            <h2>Bicis</h2>
            <br />

            <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '95%', padding: '0' }}>
                <Table striped bordered hover variant="dark" className='table-container'>
                    <thead className='sticky-header'>
                        <tr>
                            <th>Modelo</th>
                            <th>Fecha de Alta</th>
                            <th>Fecha de Baja</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Estacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bicicletas.map(bici => (
                            <tr key={bici.id}>
                                <td>{bici.modelo}</td>
                                <td>{new Date(bici.fechaAlta).toLocaleDateString()}</td>
                                <td>{bici.fechaBaja ? new Date(bici.fechaBaja).toLocaleDateString() : '-'}</td>
                                <td>{bici.motivo || '-'}</td>
                                <td className={
                                    bici.estado === 'DISPONIBLE' ? 'verde' :
                                        bici.estado === 'RESERVADA' ? 'naranja' :
                                            'rojo'
                                }>{bici.estado}</td>
                                <td>
                                    {bici.estacionID !== null ? (
                                        <a href={`https://www.google.es/maps?q=${getEstacionLat(bici.estacionID)},${getEstacionLng(bici.estacionID)}`} target="_blank" rel="noopener noreferrer" style={{ color: "lightblue", textDecoration: 'underline' }}>
                                            {getEstacionNombre(bici.estacionID)}
                                        </a>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
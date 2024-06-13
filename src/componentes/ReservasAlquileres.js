import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Modal, Button, Table, Container, Form } from 'react-bootstrap';
import { FaKey, FaParking } from "react-icons/fa";

const ReservasAlquileres = () => {
    const [reservas, setReservas] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [bicis, setBicis] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showAlquilerDialog, setShowAlquilerDialog] = useState(false);
    const [showAparcarDialog, setShowAparcarDialog] = useState(false);
    const [selectedEstacionId, setSelectedEstacionId] = useState(null);
    const [estaciones, setEstaciones] = useState([]);

    const username = sessionStorage.getItem('username');

    const fetchReservasAlquileres = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/alquileres/usuarios/${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.status === 404) {
                setShowInfoDialog(true);
            } else if (!response.ok) {
                throw new Error('Error al realizar la solicitud fetchReservasAlquileres.');
            } else {
                const data = await response.json();
                setReservas(data.reservas);
                setAlquileres(data.alquileres);
            }


        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las reservas y alquileres');
            setShowErrorDialog(true);
        }
    }, [username]);

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
                throw new Error('Error al realizar la solicitud fetchBicis.');
            }

            const data = await response.json();
            setBicis(data);
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
                throw new Error('Error al obtener las estaciones');
            }

        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    }, []);

    useEffect(() => {
        fetchReservasAlquileres();
        fetchBicis();
        fetchEstaciones();
    }, [fetchReservasAlquileres, fetchBicis, fetchEstaciones]);

    const getBiciNombre = (biciID) => {
        const bici = bicis.find(bici => bici.id === biciID);
        return bici ? bici.modelo : 'Desconocido';
    };

    const formatFechaHora = (fechaString) => {
        const fecha = new Date(fechaString);

        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11 en JavaScript
        const año = fecha.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año

        return `${horas}:${minutos} ${dia}/${mes}/${año}`;
    };

    const handleAlquiler = () => {
        setShowAlquilerDialog(true);
    };

    const handleAlquilerConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/alquileres/usuarios/${username}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                setError("Hubo un error al alquilar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada");
                setShowErrorDialog(true);
                setShowAlquilerDialog(false);
            } else {
                console.log('La alquiler se realizó correctamente');
                setShowAlquilerDialog(false);
                fetchReservasAlquileres();
            }

        } catch (error) {
            console.error('Error al crear la bici:', error);
            setError('Error interno');
            setShowErrorDialog(true);
        }
    };

    const handleAparcar = () => {
        setShowAparcarDialog(true);
    };

    const handleAparcarConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/alquileres/usuarios/${username}/estaciones/${selectedEstacionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                setError("Hubo un error al alquilar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada");
                setShowErrorDialog(true);
                setShowAparcarDialog(false);
            } else {
                console.log('La alquiler se realizó correctamente');
                setShowAparcarDialog(false);
                fetchReservasAlquileres();
            }

        } catch (error) {
            console.error('Error al crear la bici:', error);
            setError('Error interno');
            setShowErrorDialog(true);
        }
    };

    const handleEstacionChange = (event) => {
        setSelectedEstacionId(event.target.value);
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

    const InfoModal = ({ show, onClose }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className='bg-info justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Atención</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
                    No tienes ni reservas ni alquileres
                </Modal.Body>
                <Modal.Footer className='bg-info justify-content-center'>
                    <Button variant="dark" onClick={onClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const AlquilerModal = ({ show, onClose, onConfirm, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className='bg-info justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Alquilar</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
                    {message}
                </Modal.Body>
                <Modal.Footer className='bg-info justify-content-center'>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="dark" onClick={onConfirm}>
                        Alquilar <FaKey />
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const AparcarModal = ({ show, onClose, onConfirm, estaciones, selectedEstacionId, handleEstacionChange }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static">
                <Modal.Header className='bg-info justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Aparcar</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
                    Estación en la que va a aparcar
                    <br />
                    <br />
                    <Form.Select aria-label="estaciones" value={selectedEstacionId} onChange={handleEstacionChange}>
                        <option value="">Selecciona una estación</option>
                        {estaciones.map(estacion => (
                            <option key={estacion.id} value={estacion.id}>{estacion.nombre}</option>
                        ))}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer className='bg-info justify-content-center'>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="dark" onClick={onConfirm}>
                        Aparcar <FaParking />
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const sortedReservas = reservas.slice().sort((a, b) => new Date(b.creada) - new Date(a.creada));
    const sortedAlquileres = alquileres.slice().sort((a, b) => new Date(b.inicio) - new Date(a.inicio));

    return (
        <div className="tab-contenedor">
            <Row className='w-100'>
                <Col>
                    <h2>Reservas</h2>
                    <br />
                    <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '100%', padding: '0' }}>
                        <Table striped bordered hover variant="dark" className="table-responsive w-100 table-container">
                            <thead className='sticky-header'>
                                <tr>
                                    <th>Bici</th>
                                    <th>Fecha de Reserva</th>
                                    <th>Fecha de Caducidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedReservas.map(reserva => (
                                    <tr key={reserva.id}>
                                        <td>{getBiciNombre(reserva.idBicicleta)}</td>
                                        <td>{formatFechaHora(reserva.creada)}</td>
                                        <td>{formatFechaHora(reserva.caducidad)}</td>
                                        <td className={reserva.caducada ? 'rojo' : 'blanco'}>{reserva.caducada ? 'Caducada' : 'Activa'}</td>
                                        <td>
                                            {!reserva.caducada && (
                                                <Button className='custom-button' style={{ marginRight: '10px', borderRadius: '50%' }} title="Alquilar" onClick={() => handleAlquiler()}>
                                                    <FaKey />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Col>
                <Col>
                    <h2>Alquileres</h2>
                    <br />
                    <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '100%', padding: '0' }}>
                        <Table striped bordered hover variant="dark" className="table-responsive w-100 table-container">
                            <thead className='sticky-header'>
                                <tr>
                                    <th>Bici</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Fin</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAlquileres.map(alquiler => (
                                    <tr key={alquiler.id}>
                                        <td>{getBiciNombre(alquiler.idBicicleta)}</td>
                                        <td>{formatFechaHora(alquiler.inicio)}</td>
                                        <td>{alquiler.fin ? formatFechaHora(alquiler.fin) : '-'}</td>
                                        <td className={alquiler.activo ? 'verde' : 'blanco'}>{alquiler.activo ? 'Activo' : 'Terminado'}</td>
                                        <td>
                                            {alquiler.activo && (
                                                <Button className='custom-button' style={{ marginRight: '10px', borderRadius: '50%' }} title="Aparcar bici" onClick={() => handleAparcar()}>
                                                    <FaParking size={25} />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Col>
            </Row>
            <ErrorModal
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                errorMessage={error}
            />
            <InfoModal
                show={showInfoDialog}
                onClose={() => setShowInfoDialog(false)}
            />
            <AlquilerModal
                show={showAlquilerDialog}
                onClose={() => setShowAlquilerDialog(false)}
                onConfirm={handleAlquilerConfirmar}
                message="¿Quieres alquilar esta bici?"
            />
            <AparcarModal
                show={showAparcarDialog}
                onClose={() => setShowAparcarDialog(false)}
                onConfirm={handleAparcarConfirmar}
                message="¿Quieres reservar esta bici?"
                estaciones={estaciones}
                selectedEstacionId={selectedEstacionId}
                handleEstacionChange={handleEstacionChange}
            />
        </div>
    );
};

export default ReservasAlquileres;
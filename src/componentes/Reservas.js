import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import { FaKey } from "react-icons/fa";
import { fetchReservas, fetchBicis } from '../api/PeticionReservas';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [bicis, setBicis] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showAlquilerDialog, setShowAlquilerDialog] = useState(false);

    const username = sessionStorage.getItem('username');

    const fetchReservasData = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const { status, data } = await fetchReservas(username, jwtToken);
            if (status === 404) {
                setShowInfoDialog(true);
            } else {
                setReservas(data);
            }
        } catch (error) {
            setError('Error al obtener las reservas');
            setShowErrorDialog(true);
        }
    }, [username]);

    const fetchBicisData = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const data = await fetchBicis(jwtToken);
            setBicis(data);
        } catch (error) {
            setError('Error al obtener las bicis');
            setShowErrorDialog(true);
        }
    }, []);

    useEffect(() => {
        fetchReservasData();
        fetchBicisData();
    }, [fetchReservasData, fetchBicisData]);

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
                fetchReservasData();
            }

        } catch (error) {
            console.error('Error al crear la bici:', error);
            setError('Error interno');
            setShowErrorDialog(true);
        }
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

    const sortedReservas = reservas.slice().sort((a, b) => new Date(b.creada) - new Date(a.creada));

    return (
        <div className="tab-contenedor">
            <h2>Reservas</h2>
            <br />
            <Container fluid className="table-container" style={{ maxHeight: '450px', overflowY: 'auto', width: '100%', padding: '0' }}>
                {sortedReservas.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        No hay reservas realizadas
                        
                    </div>
                ) : (
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
                )}
            </Container>
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
        </div>
    );
};

export default Reservas;

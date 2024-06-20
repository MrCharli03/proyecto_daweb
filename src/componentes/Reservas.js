import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { FaKey } from "react-icons/fa";
import { fetchReservas, fetchBicis } from '../api/PeticionReservas';
import AlquilerModal from './AlquilerModal';
import InfoModal from './InfoModal';
import ErrorModal from './ErrorModal';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [bicis, setBicis] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showAlquilerDialog, setShowAlquilerDialog] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);

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

    const handleAlquiler = (reserva) => {
        setSelectedReserva(reserva);
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
                body: JSON.stringify({ idReserva: selectedReserva.id })
            });

            if (!response.ok) {
                setError("Hubo un error al alquilar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada");
                setShowErrorDialog(true);
                setShowAlquilerDialog(false);
            } else {
                console.log('El alquiler se realizó correctamente');
                setShowAlquilerDialog(false);
                fetchReservasData();
            }

        } catch (error) {
            console.error('Error al alquilar la bici:', error);
            setError('Error interno');
            setShowErrorDialog(true);
        }
    };

    const sortedReservas = reservas.slice().sort((a, b) => new Date(b.creada) - new Date(a.creada));

    return (
        <div className="tab-contenedor">
            <h2>Reservas</h2>
            <br />
            <Container fluid className="card-container">
                {sortedReservas.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        No hay reservas realizadas
                    </div>
                ) : (
                    <Row>
                        {sortedReservas.map(reserva => (
                            <Col key={reserva.id} md={6} lg={4} className="mb-4">
                                <Card
                                    style={{
                                        backgroundColor: reserva.caducada ? '#DC143C' : 'var(--olive)',
                                        color: 'white'
                                    }}
                                    className="h-100"
                                >
                                    <Card.Body>
                                        <Card.Title>{getBiciNombre(reserva.idBicicleta)}</Card.Title>
                                        <Card.Text>
                                            <strong>Fecha de Reserva:</strong> {formatFechaHora(reserva.creada)}<br />
                                            <strong>Fecha de Caducidad:</strong> {formatFechaHora(reserva.caducidad)}<br />
                                            <strong>Estado:</strong> {reserva.caducada ? 'Caducada' : 'Activa'}
                                        </Card.Text>
                                        {!reserva.caducada && (
                                            <Button variant="primary" onClick={() => handleAlquiler(reserva)}>
                                                Alquilar <FaKey /> 
                                            </Button>
                                        )}
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

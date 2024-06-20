import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FaParking } from "react-icons/fa";
import { fetchReservas, fetchEstaciones, fetchBici, aparcarBici } from '../api/PeticionAlquileres';
import InfoModal from './InfoModal';
import ErrorModal from './ErrorModal';
import AparcarModal from './AparcarModal';

const Alquileres = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [bicis, setBicis] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showAparcarDialog, setShowAparcarDialog] = useState(false);
    const [selectedEstacionId, setSelectedEstacionId] = useState(null);
    const [estaciones, setEstaciones] = useState([]);

    const username = sessionStorage.getItem('username');

    const fetchAlquileres = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const data = await fetchReservas(username, jwtToken);

            if (data.error) {
                setShowInfoDialog(true);
            } else {
                setAlquileres(data.alquileres);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener los alquileres');
            setShowErrorDialog(true);
        }
    }, [username]);

    const fetchBicis = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const data = await fetchBici(jwtToken);
            setBicis(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las bicis');
            setShowErrorDialog(true);
        }
    }, []);

    const fetchEstacionesData = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const estacionesList = await fetchEstaciones(jwtToken);
            setEstaciones(estacionesList);
        } catch (error) {
            console.error('Error:', error);
            setError(`Error al obtener las estaciones: ${error.message}`);
            setShowErrorDialog(true);
        }
    }, []);

    useEffect(() => {
        fetchAlquileres();
        fetchBicis();
        fetchEstacionesData();
    }, [fetchAlquileres, fetchBicis, fetchEstacionesData]);

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

    const handleAparcar = () => {
        setShowAparcarDialog(true);
    };

    const handleAparcarConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            await aparcarBici(username, selectedEstacionId, jwtToken);
            console.log('El aparcamiento se realizó correctamente');
            setShowAparcarDialog(false);
            fetchAlquileres();
            setSelectedEstacionId(null); // Resetear la estación seleccionada
        } catch (error) {
            console.error('Error al aparcar la bici:', error);
            setError('Hubo un error al aparcar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada');
            setShowErrorDialog(true);
            setShowAparcarDialog(false);
        }
    };

    const handleEstacionChange = (event) => {
        setSelectedEstacionId(event.target.value);
    };

    const sortedAlquileres = alquileres.slice().sort((a, b) => new Date(b.inicio) - new Date(a.inicio));

    return (
        <div className="tab-contenedor">
            <h2>Alquileres</h2>
            <br />
            <Container fluid className="card-container">
                {sortedAlquileres.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        No hay alquileres realizados
                    </div>
                ) : (
                    <Row>
                        {sortedAlquileres.map(alquiler => (
                            <Col key={alquiler.id} md={6} lg={4} className="mb-4">
                                <Card
                                    style={{
                                        backgroundColor: alquiler.activo ? 'var(--olive)' : 'grey',
                                        color: 'white'
                                    }}
                                    className="h-100"
                                >
                                    <Card.Body>
                                        <Card.Title>{getBiciNombre(alquiler.idBicicleta)}</Card.Title>
                                        <Card.Text>
                                            <strong>Fecha de Inicio:</strong> {formatFechaHora(alquiler.inicio)}<br />
                                            {!alquiler.activo && (
                                                <>
                                                    <strong>Fecha de Fin:</strong> {alquiler.fin ? formatFechaHora(alquiler.fin) : '-'}<br />
                                                    <strong>Estado:</strong> <span className={alquiler.activo ? 'verde' : 'blanco'}>{alquiler.activo ? 'Activo' : 'Terminado'}</span>
                                                </>
                                            )}
                                        </Card.Text>
                                        {alquiler.activo && (
                                            <Button variant="primary" onClick={handleAparcar} title="Aparcar bici">
                                                <FaParking size={25} /> Aparcar
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
            <AparcarModal
                show={showAparcarDialog}
                onClose={() => setShowAparcarDialog(false)}
                onConfirm={handleAparcarConfirmar}
                estaciones={estaciones}
                selectedEstacionId={selectedEstacionId}
                handleEstacionChange={handleEstacionChange}
            />
        </div>
    );
};

export default Alquileres;

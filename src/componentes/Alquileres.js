import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { FaParking } from "react-icons/fa";
import { fetchReservas, fetchEstaciones, fetchBici, aparcarBici } from '../api/PeticionAlquileres';

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

    const sortedAlquileres = alquileres.slice().sort((a, b) => new Date(b.inicio) - new Date(a.inicio));

    return (
        <div className="tab-contenedor">
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
                                        <Button className='custom-button' style={{ marginRight: '10px', borderRadius: '50%' }} title="Aparcar bici" onClick={handleAparcar}>
                                            <FaParking size={25} />
                                        </Button>
                                    )}
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

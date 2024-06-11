import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsPencil, BsTrash, BsPlusCircleFill } from 'react-icons/bs';
import { MdDirectionsBike } from "react-icons/md";
import { FaCircleLeft } from "react-icons/fa6";
import { FaKey, FaCalendarCheck, FaSearch } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../styles/Estaciones.css';

const Estaciones = () => {
    const [estaciones, setEstaciones] = useState([]);
    const [error, setError] = useState(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedEstacionId, setSelectedEstacionId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editNombre, setEditNombre] = useState('');
    const [editNumPuestos, setEditNumPuestos] = useState('');
    const [editCodPostal, setEditCodPostal] = useState('');
    const [editLat, setEditLat] = useState('');
    const [editLng, setEditLng] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addNombre, setAddNombre] = useState('');
    const [addNumPuestos, setAddNumPuestos] = useState('');
    const [addCodPostal, setAddCodPostal] = useState('');
    const [addLat, setAddLat] = useState('');
    const [addLng, setAddLng] = useState('');
    const [bicicletasEstacion, setBicicletasEstacion] = useState([]);
    const [estacionVerBicis, setEstacionVerBicis] = useState(null);

    const userRole = sessionStorage.getItem('userRole');

    useEffect(() => {
        fetchEstaciones();
    }, []);

    const fetchEstaciones = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:8090/estaciones/listado?page=0&size=-1', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar la solicitud.');
            }

            const data = await response.json();
            const estacionesList = data._embedded.estacionDTOList;
            setEstaciones(estacionesList);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    };

    const handleModificar = (id) => {
        const estacion = estaciones.find(estacion => estacion.id === id);
        setEditNombre(estacion.nombre);
        setEditNumPuestos(estacion.numPuestos);
        setEditCodPostal(estacion.codPostal);
        setEditLat(estacion.lat);
        setEditLng(estacion.lng);
        setSelectedEstacionId(id);
        setShowEditDialog(true);
    };

    const handleModificarConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const id = selectedEstacionId;

        try {
            const estacionData = {
                nombre: editNombre,
                numPuestos: editNumPuestos,
                codPostal: editCodPostal,
                lat: editLat,
                lng: editLng,
            };

            const response = await fetch(`http://localhost:8090/estaciones/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(estacionData)
            });

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowErrorDialog(true);
                setShowEditDialog(false);
            } else if (!response.ok) {
                setError("No se pudo modificar la estacion");
                setShowErrorDialog(true);
            } else {
                console.log('La estación se modificó exitosamente');
                setShowEditDialog(false);
                fetchEstaciones();
            }
        } catch (error) {
            console.error('Error al modificar la estación:', error);
            setError('Error intero');
            setShowErrorDialog(true);
            setShowEditDialog(false);
        }
    };

    const handleEliminar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const id = selectedEstacionId;

        try {
            const response = await fetch(`http://localhost:8090/estaciones/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowConfirmDialog(false);
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("No se puede eliminar una estación que tenga bicis");
                setShowConfirmDialog(false);
                setShowErrorDialog(true);
            } else {
                console.log('La estación se eliminó exitosamente');
                fetchEstaciones();
                setShowConfirmDialog(false);
            }

        } catch (error) {
            console.error('Error al eliminar la estación:', error);
            setError('Error interno');
            setShowConfirmDialog(false);
            setShowErrorDialog(true);
        }
    };

    const handleCancelar = () => {
        setShowEditDialog(false);
    };

    const confirmEliminar = (id) => {
        setSelectedEstacionId(id);
        setShowConfirmDialog(true);
    };

    const handleAddEstacion = () => {
        setShowAddDialog(true);
    };

    const handleAddEstacionConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const nuevaEstacion = {
            nombre: addNombre,
            numPuestos: addNumPuestos,
            codPostal: addCodPostal,
            lat: addLat,
            lng: addLng
        };

        try {
            const response = await fetch('http://localhost:8090/estaciones/estacionesBicicletas', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaEstacion)
            });

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowAddDialog(false);
                setShowErrorDialog(true);
            } else if (addNumPuestos < 3) {
                setError("El número mínimo de puestos es 3");
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("Hubo un error al crear la estacion");
                setShowErrorDialog(true);
            } else {
                console.log('La estación se creó exitosamente');

                setAddNombre('');
                setAddNumPuestos('');
                setAddCodPostal('');
                setAddLat('');
                setAddLng('');
                setShowAddDialog(false);
                fetchEstaciones();
            }

        } catch (error) {
            console.error('Error al agregar la estación:', error);
            setError('Error interno');
            setShowErrorDialog(true);
            setShowAddDialog(false);
        }
    };

    const handleCancelarAddEstacion = () => {
        setShowAddDialog(false);
        setAddNombre('');
        setAddNumPuestos('');
        setAddCodPostal('');
        setAddLat('');
        setAddLng('');
    };

    const verBicicletasEstacion = async (idEstacion, nombre) => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await fetch(`http://localhost:8090/estaciones/${idEstacion}/bicicletas?page=0&size=-1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las bicicletas');
            }

            const data = await response.json();
            if (data.hasOwnProperty('_embedded')) {
                const bicisList = data._embedded.biciDTOList;
                console.log('Data de Bicicletas Estacion:', bicisList);
                setBicicletasEstacion(bicisList);
                setEstacionVerBicis(nombre);
            } else {
                setError('Esta estación no tiene bicis');
                setShowErrorDialog(true);
                return;
            }
        } catch (error) {
            console.error(error);
            setError('Error al intentar mostrar las bicis');
            setShowErrorDialog(true);
        }
    };

    const volverAEstaciones = () => {
        setEstacionVerBicis(null);
    };

    const ErrorModal = ({ show, onClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={onClose} centered>
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

    const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header className='justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Eliminar</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>{message}</Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirmar <BsTrash />
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="tab-contenedor">
            {estacionVerBicis ? (
                <>
                    <h2>{estacionVerBicis}</h2>
                    <br />
                    <div style={{ maxHeight: '450px', overflowY: 'auto', width: '70%' }}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Modelo</th>
                                    <th>Fecha de Alta</th>
                                    <th>Fecha de Baja</th>
                                    <th>Motivo</th>
                                    <th>Estado</th>
                                    <th>Reservar | Alquilar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bicicletasEstacion.map(bici => (
                                    <tr key={bici._id}>
                                        <td>{bici.modelo}</td>
                                        <td>{new Date(bici.fechaAlta).toLocaleDateString()}</td>
                                        <td>{bici.fechaBaja ? new Date(bici.fechaBaja).toLocaleDateString() : '-'}</td>
                                        <td>{bici.motivo || '-'}</td>
                                        <td className={bici.estado === 'DISPONIBLE' ? 'verde' : 'rojo'}>{bici.estado}</td>
                                        <td>
                                            <Button className='custom-button' style={{ marginRight: '10px' }}>
                                                <FaCalendarCheck />
                                            </Button>
                                            <Button className='custom-button'>
                                                <FaKey />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                    <Button onClick={volverAEstaciones} variant='secondary'><FaCircleLeft /> Volver</Button>
                </>
            ) : (
                <>
                    <h2>Estaciones</h2>
                    <br />
                    <InputGroup>
                        <Button style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '3%', alignSelf: 'flex-start' }} ><FaSearch /></Button>
                        <Form.Group>
                            <Form.Control
                                placeholder="Nombre"
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', maxWidth: '200px', borderRadius: '0' }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder="Código Postal"
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', maxWidth: '200px', borderRadius: '0' }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder="Número de puestos"
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', maxWidth: '200px', borderRadius: '0' }}
                            />
                        </Form.Group>
                        {userRole === 'Gestor' && (
                            <div style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '1%', alignSelf: 'flex-start' }}>
                                <Button className='custom-button' onClick={handleAddEstacion}>
                                    <BsPlusCircleFill /> Agregar Estación
                                </Button>
                            </div>
                        )}
                    </InputGroup>

                    <div style={{ maxHeight: '450px', overflowY: 'auto', width: '95%' }}>

                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Número de Puestos</th>
                                    <th>Código Postal</th>
                                    <th>Latitud</th>
                                    <th>Longitud</th>
                                    <th>Fecha de Alta</th>
                                    <th>Bicicletas</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estaciones.map(estacion => (
                                    <tr key={estacion.id}>
                                        <td>{estacion.nombre}</td>
                                        <td>{estacion.numPuestos}</td>
                                        <td>{estacion.codPostal}</td>
                                        <td>{estacion.lat}</td>
                                        <td>{estacion.lng}</td>
                                        <td>{new Date(estacion.fechaAlta).toLocaleDateString()}</td>
                                        <td>
                                            <ul>
                                                {estacion.bicis.map(bici => (
                                                    <li key={bici._id}>{bici.modelo}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            <div>
                                                {userRole === 'Gestor' && (
                                                    <>
                                                        <Button variant="primary" style={{ marginRight: '10px', borderRadius: '50%' }} onClick={() => handleModificar(estacion.id)}>
                                                            <BsPencil />
                                                        </Button>
                                                        <Button variant="danger" style={{ marginRight: '10px', borderRadius: '50%' }} onClick={() => confirmEliminar(estacion.id)}>
                                                            <BsTrash />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button className='custom-button' style={{ borderRadius: '50%' }} onClick={() => verBicicletasEstacion(estacion.id, estacion.nombre)}>
                                                    <MdDirectionsBike />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </>
            )}

            <ErrorModal
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                errorMessage={error}
            />
            <ConfirmModal
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleEliminar}
                message="¿Estás seguro de que deseas eliminar esta estación?"
            />
            <Modal show={showEditDialog} onHide={() => setShowEditDialog(false)} centered>
                <Modal.Header className="justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>Modificar Estación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formNumPuestos">
                            <Form.Label>Número de Puestos</Form.Label>
                            <Form.Control type="number" value={editNumPuestos} min="3" onChange={(e) => setEditNumPuestos(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodPostal">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control type="text" value={editCodPostal} onChange={(e) => setEditCodPostal(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formLat">
                            <Form.Label>Latitud</Form.Label>
                            <Form.Control type="text" value={editLat} onChange={(e) => setEditLat(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formLng">
                            <Form.Label>Longitud</Form.Label>
                            <Form.Control type="text" value={editLng} onChange={(e) => setEditLng(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={handleCancelar}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleModificarConfirmar}>
                        Modificar <BsPencil />
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddDialog} onHide={handleCancelarAddEstacion} centered>
                <Modal.Header className="justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>Agregar Estación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={addNombre} onChange={(e) => setAddNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formNumPuestos">
                            <Form.Label>Número de Puestos</Form.Label>
                            <Form.Control type="number" value={addNumPuestos} min="3" onChange={(e) => setAddNumPuestos(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCodPostal">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control type="text" value={addCodPostal} onChange={(e) => setAddCodPostal(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formLat">
                            <Form.Label>Latitud</Form.Label>
                            <Form.Control type="text" value={addLat} onChange={(e) => setAddLat(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formLng">
                            <Form.Label>Longitud</Form.Label>
                            <Form.Control type="text" value={addLng} onChange={(e) => setAddLng(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={handleCancelarAddEstacion}>
                        Cancelar
                    </Button>
                    <Button className='custom-button' onClick={handleAddEstacionConfirmar}>
                        Agregar <BsPlusCircleFill />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Estaciones;
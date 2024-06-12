import React, { useState, useEffect, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsFillPencilFill, BsPlusCircleFill } from 'react-icons/bs';
import { MdDirectionsBike, MdCleaningServices } from "react-icons/md";
import { FaCircleLeft } from "react-icons/fa6";
import { FaKey, FaCalendarCheck, FaSearch, FaTrash } from "react-icons/fa";
import { BiSolidDislike } from 'react-icons/bi';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../styles/Estaciones.css';
import '../styles/Registro.css';

const Estaciones = () => {
    const [estaciones, setEstaciones] = useState([]);
    const [error, setError] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [info, setInfo] = useState('');
    const [showInfoDialog, setShowInfoDialog] = useState(false);
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
    const [buscarNombre, setBuscarNombre] = useState('');
    const [buscarCodPostal, setBuscarCodPostal] = useState('');
    const [buscarNumPuestos, setBuscarNumPuestos] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [showBusquedaDialog, setShowBusquedaDialog] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [showBajaBiciDialog, setShowBajaBiciDialog] = useState(false);
    const [showConfirmBiciDialog, setShowConfirmBiciDialog] = useState(false);
    const [selectedBiciId, setSelectedBiciId] = useState(null);
    const [estacionActual, setEstacionActual] = useState(null);
    const [nombreActual, setNombreActual] = useState(null);
    const [showAddBiciDialog, setShowAddBiciDialog] = useState(false);
    const [addModelo, setAddModelo] = useState('');

    const userRole = sessionStorage.getItem('userRole');

    const fetchEstaciones = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const nombre = buscarNombre;
        const codPostal = buscarCodPostal;
        const numPuestos = buscarNumPuestos;

        try {
            const response = await fetch(`http://localhost:8090/estaciones/listado?nombre=${nombre}&codPostal=${codPostal}&numPuestos=${numPuestos}&page=0&size=-1`, {
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
                setBusqueda('No se encontró nada');
                setShowBusquedaDialog(true);
            }

        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    }, [buscarCodPostal, buscarNombre, buscarNumPuestos]);

    useEffect(() => {
        fetchEstaciones();
    }, [fetchEstaciones]);

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
        setEstacionActual(idEstacion);
        setNombreActual(nombre);
        setBicicletasEstacion([]);

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
                setEstacionVerBicis(nombre);
                setInfo('Esta estación no tiene bicis');
                setShowInfoDialog(true);
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

    const limpiarBusqueda = async () => {
        setBuscarNombre('');
        setBuscarCodPostal('');
        setBuscarNumPuestos('');

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
                setBusqueda('No se encontró nada');
                setShowBusquedaDialog(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    };

    const handleCancelarBajaBici = () => {
        setShowBajaBiciDialog(false);
        setMotivo('');
    };

    const handlePrevioBajaBici = async (idBici) => {
        setSelectedBiciId(idBici);
        setShowBajaBiciDialog(true);
    };

    const mostrarConfirmBajaBici = () => {
        setShowBajaBiciDialog(false);
        setShowConfirmBiciDialog(true);
    };

    const handleCancelarBajaBiciConfirm = () => {
        setShowConfirmBiciDialog(false);
        setMotivo('');
    }

    const handleBajaBici = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const id = selectedBiciId;
        const motivoBaja = motivo;

        try {
            const response = await fetch(`http://localhost:8090/estaciones/bicicletas/${id}?motivo=${motivoBaja}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowErrorDialog(true);
                setShowConfirmBiciDialog(false);
            } else if (!response.ok) {
                setError("Error al dar de baja la bici");
                setShowErrorDialog(true);
                setShowConfirmBiciDialog(false);
            } else {
                console.log('La bici se dio de baja exitosamente');
                fetchEstaciones();
                setShowConfirmBiciDialog(false);
                verBicicletasEstacion(estacionActual, nombreActual);
            }

        } catch (error) {
            console.error('Error al dar de baja la bici:', error);
            setError('Error interno');
            setShowConfirmDialog(false);
            setShowErrorDialog(true);
        }
    };

    const handleAddBici = () => {
        setShowAddBiciDialog(true);
    };

    const handleAddBiciConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        console.log('Estacion actual:', estacionActual);
        const nuevaBici = {
            modelo: addModelo,
            idEstacion: estacionActual,
        };

        try {
            const response = await fetch('http://localhost:8090/estaciones/bicicletas', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaBici)
            });

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowAddBiciDialog(false);
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("Hubo un error al crear la bici");
                setShowErrorDialog(true);
            } else {
                console.log('La bici se creó exitosamente');
                setShowAddBiciDialog(false);
                verBicicletasEstacion(estacionActual, nombreActual);
            }

        } catch (error) {
            console.error('Error al crear la bici:', error);
            setError('Error interno');
            setShowErrorDialog(true);
            setShowAddBiciDialog(false);
        }
    };

    const handleCancelarAddBici = () => {
        setShowAddBiciDialog(false);
        setAddModelo('');
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

    const BusquedaModal = ({ show, onClose, busquedaMessage }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className="bg-info justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>{busquedaMessage}</Modal.Title>
                </Modal.Header>
                <Modal.Footer className="bg-info justify-content-center">
                    <Button variant="dark" onClick={onClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className='justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Eliminar</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>{message}</Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirmar <FaTrash />
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const ConfirmBiciModal = ({ show, onClose, onConfirm, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className='bg-info justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Dar de Baja</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
                    {message}
                    <br />
                    <br />
                    Motivo: "<span style={{ fontWeight: 'bold', wordWrap: 'break-word' }}>{motivo}</span>"
                </Modal.Body>
                <Modal.Footer className='bg-info justify-content-center'>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirmar <BiSolidDislike />
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const InfoModal = ({ show, onClose, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className='bg-info justify-content-center'>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Atención</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
                    {message}
                </Modal.Body>
                <Modal.Footer className='bg-info justify-content-center'>
                    <Button variant="dark" onClick={onClose}>
                        OK
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
                                    <th>Acciones</th>
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
                                            <div>
                                                {userRole === 'Gestor' && (
                                                    <>
                                                        <Button variant="danger" style={{ marginRight: '10px', borderRadius: '50%' }} title="Dar de Baja" onClick={() => handlePrevioBajaBici(bici.id)}>
                                                            <BiSolidDislike />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button className='custom-button' style={{ marginRight: '10px', borderRadius: '50%' }} title="Reservar">
                                                    <FaCalendarCheck />
                                                </Button>
                                                <Button className='custom-button' style={{ borderRadius: '50%' }} title="Alquilar">
                                                    <FaKey />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </div>
                    <div style={{ mariginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={volverAEstaciones} variant='secondary' style={{ marginRight: '10px' }}><FaCircleLeft /> Volver</Button>
                        {userRole === 'Gestor' && (
                            <Button className='custom-button' onClick={handleAddBici}>
                                <BsPlusCircleFill /> Agregar Bici
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h2>Estaciones</h2>
                    <br />
                    <InputGroup>
                        <Button variant='dark' style={{ marginLeft: '8%', alignSelf: 'flex-start' }} onClick={() => fetchEstaciones()}><FaSearch /></Button>
                        <Form.Group>
                            <Form.Control
                                placeholder="Nombre"
                                type="text"
                                value={buscarNombre}
                                onChange={(e) => setBuscarNombre(e.target.value)}
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '300px', borderRadius: '0' }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder="Código Postal"
                                type="text"
                                value={buscarCodPostal}
                                onChange={(e) => setBuscarCodPostal(e.target.value)}
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '150px', borderRadius: '0' }}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                placeholder="Número de puestos"
                                type="number"
                                className='no-spinner'
                                value={buscarNumPuestos}
                                onChange={(e) => setBuscarNumPuestos(e.target.value)}
                                style={{ textAlign: 'left', marginBottom: '1%', alignSelf: 'flex-start', width: '170px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                            />
                        </Form.Group>
                        <div style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '1%', alignSelf: 'flex-start' }}>
                            <Button variant='info' onClick={limpiarBusqueda}>
                                <MdCleaningServices /> Limpiar busqueda
                            </Button>
                        </div>
                        {userRole === 'Gestor' && (
                            <div style={{ textAlign: 'left', marginBottom: '1%', marginLeft: '1%', alignSelf: 'flex-start' }}>
                                <Button className='custom-button' onClick={handleAddEstacion}>
                                    <BsPlusCircleFill /> Agregar Estación
                                </Button>
                            </div>
                        )}
                    </InputGroup>

                    <div style={{ maxHeight: '450px', overflowY: 'auto', width: '85%' }}>

                        <Table striped bordered hover variant="dark">
                            <thead>
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
                    </div>
                </>
            )
            }

            <ErrorModal
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                errorMessage={error}
            />
            <BusquedaModal
                show={showBusquedaDialog}
                onClose={() => setShowBusquedaDialog(false)}
                busquedaMessage={busqueda}
            />
            <ConfirmModal
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleEliminar}
                message="¿Estás seguro de que deseas eliminar esta estación?"
            />
            <ConfirmBiciModal
                show={showConfirmBiciDialog}
                onClose={() => handleCancelarBajaBiciConfirm()}
                onConfirm={handleBajaBici}
                message="¿Estás seguro de que deseas dar de baja esta bici?"
            />
            <InfoModal
                show={showInfoDialog}
                onClose={() => setShowInfoDialog(false)}
                message={info}
            />
            <Modal show={showEditDialog} onHide={() => setShowEditDialog(false)} centered backdrop="static">
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
                        Modificar <BsFillPencilFill />
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddDialog} onHide={handleCancelarAddEstacion} centered backdrop="static">
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
            <Modal show={showBajaBiciDialog} onHide={handleCancelarBajaBici} centered backdrop="static">
                <Modal.Header className="justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>Dar bici de baja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Motivo</Form.Label>
                            <Form.Control type="text" value={motivo} placeholder='Motivo' onChange={(e) => setMotivo(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={handleCancelarBajaBici}>
                        Cancelar
                    </Button>
                    <Button className='custom-button' onClick={mostrarConfirmBajaBici}>
                        Dar de Baja <BsPlusCircleFill />
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddBiciDialog} onHide={handleCancelarAddBici} centered backdrop="static">
                <Modal.Header className="justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold' }}>Agregar Bici</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formModelo">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control type="text" placeholder='Modelo' value={addModelo} onChange={(e) => setAddModelo(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={handleCancelarAddBici}>
                        Cancelar
                    </Button>
                    <Button className='custom-button' onClick={handleAddBiciConfirmar}>
                        Agregar <BsPlusCircleFill />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default Estaciones;
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';
import { FaCircleLeft } from "react-icons/fa6";
import '../styles/Estaciones.css';
import '../styles/Registro.css';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import InfoModal from './InfoModal';
import AlquilerModal from './AlquilerModal';
import ReservaModal from './ReservaModal';
import EstacionForm from './EstacionForm';
import BiciTable from './BicisEstaciones';
import SearchBar from './SearchBar';
import AddBiciModal from './AddBiciModal';
import EstacionTable from './EstacionCards';
import BajaBiciModal from './BajaBiciModal'; 
import ConfirmBiciModal from './ConfirmBiciModal'; 
import {
    fetchEstaciones,
    modificarEstacion,
    eliminarEstacion,
    agregarEstacion,
    fetchBicicletasEstacion,
    agregarBici,
    alquilarBici,
    reservarBici,
    darBajaBici
} from '../api/PeticionEstaciones';

const Estaciones = () => {
    const [estaciones, setEstaciones] = useState([]);
    const [error, setError] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [info, setInfo] = useState('');
    const [infoTitle, setInfoTitle] = useState('');
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
    const [buscarTermino, setBuscarTermino] = useState('');
    const [numPuestos, setNumPuestos] = useState('');
    const [selectedBiciId, setSelectedBiciId] = useState(null);
    const [estacionActual, setEstacionActual] = useState(null);
    const [nombreActual, setNombreActual] = useState(null);
    const [showAddBiciDialog, setShowAddBiciDialog] = useState(false);
    const [addModelo, setAddModelo] = useState('');
    const [showAlquilerDialog, setShowAlquilerDialog] = useState(false);
    const [showReservaDialog, setShowReservaDialog] = useState(false);
    const [showBajaBiciDialog, setShowBajaBiciDialog] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [showConfirmBiciDialog, setShowConfirmBiciDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('username');

    const fetchEstacionesCallback = useCallback(async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const [nombre, codPostal] = parseSearchTerm(buscarTermino);
        const numP = numPuestos;

        try {
            const data = await fetchEstaciones(jwtToken, nombre, codPostal, numP, currentPage, 6);
            if (data.hasOwnProperty('_embedded')) {
                const estacionesList = data._embedded.estacionDTOList;
                setEstaciones(estacionesList);
                setTotalPages(data.page.totalPages);  // Assuming the response has a page object with totalPages
            } else {
                setEstaciones([]);  // Clear estaciones if no data found
                setInfo('No se encontró nada');
                setInfoTitle('Búsqueda');
                setShowInfoDialog(true);
            }
        } catch (error) {
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    }, [buscarTermino, numPuestos, currentPage]);

    const parseSearchTerm = (term) => {
        const regex = /(\d{1,5})|([^,\d]+)/g;
        const matches = term.match(regex);
        let nombre = '';
        let codPostal = '';
    
        matches?.forEach(match => {
            if (/^\d{1,5}$/.test(match)) { 
                codPostal = match;
            } else if (match.trim().length > 0) {
                nombre = match.trim();
            }
        });
    
        return [nombre, codPostal];
    };

    useEffect(() => {
        const initialFetch = async () => {
            if (buscarTermino === '' && numPuestos === '') {
                const jwtToken = sessionStorage.getItem('jwtToken');
                try {
                    const data = await fetchEstaciones(jwtToken, '', '', '', currentPage, 6);
                    if (data.hasOwnProperty('_embedded')) {
                        const estacionesList = data._embedded.estacionDTOList;
                        setEstaciones(estacionesList);
                        setTotalPages(data.page.totalPages);  // Assuming the response has a page object with totalPages
                    } else {
                        setEstaciones([]);  // Clear estaciones if no data found
                        setInfo('No se encontró nada');
                        setInfoTitle('Búsqueda');
                        setShowInfoDialog(true);
                    }
                } catch (error) {
                    setError('Error al obtener las estaciones');
                    setShowErrorDialog(true);
                }
            } else {
                fetchEstacionesCallback();
            }
        };

        initialFetch();
    }, [buscarTermino, numPuestos, currentPage, fetchEstacionesCallback]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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

            const response = await modificarEstacion(jwtToken, id, estacionData);

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowErrorDialog(true);
                setShowEditDialog(false);
            } else if (!response.ok) {
                setError("No se pudo modificar la estación");
                setShowErrorDialog(true);
            } else {
                setShowEditDialog(false);
                fetchEstacionesCallback();
            }
        } catch (error) {
            setError('Error interno');
            setShowErrorDialog(true);
            setShowEditDialog(false);
        }
    };

    const handleEliminar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const id = selectedEstacionId;

        try {
            const response = await eliminarEstacion(jwtToken, id);

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowConfirmDialog(false);
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("No se puede eliminar una estación que tenga bicis");
                setShowConfirmDialog(false);
                setShowErrorDialog(true);
            } else {
                fetchEstacionesCallback();
                setShowConfirmDialog(false);
            }

        } catch (error) {
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
            const response = await agregarEstacion(jwtToken, nuevaEstacion);

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowAddDialog(false);
                setShowErrorDialog(true);
            } else if (addNumPuestos < 3) {
                setError("El número mínimo de puestos es 3");
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("Hubo un error al crear la estación");
                setShowErrorDialog(true);
            } else {
                setAddNombre('');
                setAddNumPuestos('');
                setAddCodPostal('');
                setAddLat('');
                setAddLng('');
                setShowAddDialog(false);
                fetchEstacionesCallback();
            }

        } catch (error) {
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
            const data = await fetchBicicletasEstacion(jwtToken, idEstacion);
            if (data.hasOwnProperty('_embedded')) {
                const bicisList = data._embedded.biciDTOList;
                setBicicletasEstacion(bicisList);
                setEstacionVerBicis(nombre);
            } else {
                setEstacionVerBicis(nombre);
            }
        } catch (error) {
            setError('Error al intentar mostrar las bicis');
            setShowErrorDialog(true);
        }
    };

    const volverAEstaciones = () => {
        setEstacionVerBicis(null);
    };

    const limpiarBusqueda = async () => {
        setBuscarTermino('');
        setNumPuestos('');

        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const data = await fetchEstaciones(jwtToken, '', '', '', currentPage, 6);
            if (data.hasOwnProperty('_embedded')) {
                const estacionesList = data._embedded.estacionDTOList;
                setEstaciones(estacionesList);
            } else {
                setEstaciones([]);  // Clear estaciones if no data found
                setInfo('No se encontró nada');
                setInfoTitle('Búsqueda');
                setShowInfoDialog(true);
            }
        } catch (error) {
            setError('Error al obtener las estaciones');
            setShowErrorDialog(true);
        }
    };

    const handleAddBici = () => {
        setShowAddBiciDialog(true);
    };

    const handleAddBiciConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const nuevaBici = {
            modelo: addModelo,
            idEstacion: estacionActual,
        };

        try {
            const response = await agregarBici(jwtToken, nuevaBici);

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowAddBiciDialog(false);
                setShowErrorDialog(true);
            } else if (!response.ok) {
                setError("Hubo un error al crear la bici");
                setShowErrorDialog(true);
            } else {
                setShowAddBiciDialog(false);
                verBicicletasEstacion(estacionActual, nombreActual);
                fetchEstacionesCallback();
            }

        } catch (error) {
            setError('Error interno');
            setShowErrorDialog(true);
            setShowAddBiciDialog(false);
        }
    };

    const handleCancelarAddBici = () => {
        setShowAddBiciDialog(false);
        setAddModelo('');
    };

    const handleAlquiler = (idBici) => {
        setSelectedBiciId(idBici);
        setShowAlquilerDialog(true);
    };

    const handleAlquilerConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await alquilarBici(jwtToken, username, selectedBiciId);

            if (!response.ok) {
                setError("Hubo un error al alquilar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada");
                setShowErrorDialog(true);
                setShowAlquilerDialog(false);
            } else {
                setShowAlquilerDialog(false);
                verBicicletasEstacion(estacionActual, nombreActual);
            }

        } catch (error) {
            setError('Error interno');
            setShowErrorDialog(true);
        }
    };

    const handleReservar = (idBici) => {
        setSelectedBiciId(idBici);
        setShowReservaDialog(true);
    };

    const handleReservaConfirmar = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');

        try {
            const response = await reservarBici(jwtToken, username, selectedBiciId);

            if (!response.ok) {
                setError("Hubo un error al reservar la bici, puede que ya tengas un alquiler/reserva activos o la bici ya esté reservada");
                setShowErrorDialog(true);
                setShowReservaDialog(false);
            } else {
                setShowReservaDialog(false);
                verBicicletasEstacion(estacionActual, nombreActual);
            }
        } catch (error) {
            setError('Error interno');
            setShowErrorDialog(true);
        }
    };

    const handlePrevioBajaBici = async (idBici) => {
        setSelectedBiciId(idBici);
        setShowBajaBiciDialog(true);
    };

    const handleCancelarBajaBici = () => {
        setShowBajaBiciDialog(false);
        setMotivo('');
    };

    const mostrarConfirmBajaBici = () => {
        setShowBajaBiciDialog(false);
        setShowConfirmBiciDialog(true); // Show the confirm bici dialog
    };

    const handleBajaBici = async () => {
        const jwtToken = sessionStorage.getItem('jwtToken');
        const id = selectedBiciId;
        const motivoBaja = motivo;

        try {
            const response = await darBajaBici(jwtToken, id, motivoBaja);

            if (response.status === 403) {
                setError("No tienes permisos de Gestor");
                setShowErrorDialog(true);
                setShowConfirmBiciDialog(false); // Close the confirm bici dialog
            } else if (!response.ok) {
                setError("Error al dar de baja la bici");
                setShowErrorDialog(true);
                setShowConfirmBiciDialog(false); // Close the confirm bici dialog
            } else {
                fetchEstacionesCallback();
                verBicicletasEstacion(estacionActual, nombreActual);
                setShowConfirmBiciDialog(false); // Close the confirm bici dialog
            }

        } catch (error) {
            setError('Error interno');
            setShowConfirmBiciDialog(false); // Close the confirm bici dialog
            setShowErrorDialog(true);
        }
    };

    return (
        <div className="tab-contenedor">
            {estacionVerBicis ? (
                <>
                    <h2>{estacionVerBicis}</h2>
                    <br />
                    <BiciTable
                        bicicletasEstacion={bicicletasEstacion}
                        userRole={userRole}
                        handlePrevioBajaBici={handlePrevioBajaBici}
                        handleReservar={handleReservar}
                        handleAlquiler={handleAlquiler}
                    />
                    <div style={{ mariginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={volverAEstaciones} variant='secondary' style={{ marginRight: '10px' }}><FaCircleLeft /> Volver</Button>
                        {userRole === 'Gestor' && (
                            <Button className='custom-button' onClick={handleAddBici}>
                                <BsPlusCircleFill /> <span style={{ marginLeft: '5px' }}>Agregar Bici</span>
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h2>Estaciones</h2>
                    <br />
                    <SearchBar
                        buscarTermino={buscarTermino}
                        setBuscarTermino={setBuscarTermino}
                        numPuestos={numPuestos}
                        setNumPuestos={setNumPuestos}
                        fetchEstaciones={fetchEstacionesCallback}
                        limpiarBusqueda={limpiarBusqueda}
                        userRole={userRole}
                        handleAddEstacion={handleAddEstacion}
                    />
                    <br />
                    <EstacionTable
                        estaciones={estaciones}
                        userRole={userRole}
                        handleModificar={handleModificar}
                        confirmEliminar={confirmEliminar}
                        verBicicletasEstacion={verBicicletasEstacion}
                    />
                    <br />
                    <Pagination>
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <Pagination.Item key={index} active={index === currentPage} onClick={() => handlePageChange(index)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                    </Pagination>
                </>
            )}
    
            <ErrorModal
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                errorMessage={error}
            />
            <InfoModal
                show={showInfoDialog}
                onClose={() => setShowInfoDialog(false)}
                title={infoTitle}
                message={info}
            />
            <ConfirmModal
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleEliminar}
                message="¿Estás seguro de que deseas eliminar esta estación?"
            />
            <AlquilerModal
                show={showAlquilerDialog}
                onClose={() => setShowAlquilerDialog(false)}
                onConfirm={handleAlquilerConfirmar}
                message="¿Quieres alquilar esta bici?"
            />
            <ReservaModal
                show={showReservaDialog}
                onClose={() => setShowReservaDialog(false)}
                onConfirm={handleReservaConfirmar}
                message="¿Quieres reservar esta bici?"
            />
            <EstacionForm
                show={showEditDialog}
                onHide={handleCancelar}
                title="Modificar Estación"
                nombre={editNombre}
                setNombre={setEditNombre}
                numPuestos={editNumPuestos}
                setNumPuestos={setEditNumPuestos}
                codPostal={editCodPostal}
                setCodPostal={setEditCodPostal}
                lat={editLat}
                setLat={setEditLat}
                lng={editLng}
                setLng={setEditLng}
                onSubmit={handleModificarConfirmar}
                submitText="Modificar"
                isEdit={true}
            />
            <EstacionForm
                show={showAddDialog}
                onHide={handleCancelarAddEstacion}
                title="Agregar Estación"
                nombre={addNombre}
                setNombre={setAddNombre}
                numPuestos={addNumPuestos}
                setNumPuestos={setAddNumPuestos}
                codPostal={addCodPostal}
                setCodPostal={setAddCodPostal}
                lat={addLat}
                setLat={setAddLat}
                lng={addLng}
                setLng={setAddLng}
                onSubmit={handleAddEstacionConfirmar}
                submitText="Agregar"
                isEdit={false}
            />
            <AddBiciModal
                show={showAddBiciDialog}
                onHide={handleCancelarAddBici}
                modelo={addModelo}
                setModelo={setAddModelo}
                onConfirm={handleAddBiciConfirmar}
            />
            <BajaBiciModal 
                show={showBajaBiciDialog}
                onHide={handleCancelarBajaBici}
                motivo={motivo}
                setMotivo={setMotivo}
                mostrarConfirmBajaBici={mostrarConfirmBajaBici}
            />
            <ConfirmBiciModal
                show={showConfirmBiciDialog}
                onClose={() => setShowConfirmBiciDialog(false)}
                onConfirm={handleBajaBici}
                message="¿Estás seguro de que deseas dar de baja esta bici?"
                motivo={motivo}
            />
        </div>
    );
}

export default Estaciones;

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaParking } from "react-icons/fa";

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

export default AparcarModal;
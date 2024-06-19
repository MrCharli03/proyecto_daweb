import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaKey } from "react-icons/fa";

const AlquilerModal = ({ show, onClose, onConfirm, message }) => (
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

export default AlquilerModal;

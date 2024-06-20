import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from "react-icons/fa";

const ConfirmModal = ({ show, onClose, onConfirm, message }) => (
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

export default ConfirmModal;

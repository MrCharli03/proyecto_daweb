import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCalendarCheck } from "react-icons/fa";

const ReservaModal = ({ show, onClose, onConfirm, message }) => (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
        <Modal.Header className='bg-info justify-content-center'>
            <Modal.Title style={{ fontWeight: 'bold' }}>Reservar</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-info' style={{ textAlign: 'center' }}>
            {message}
        </Modal.Body>
        <Modal.Footer className='bg-info justify-content-center'>
            <Button variant="secondary" onClick={onClose}>
                Cancelar
            </Button>
            <Button variant="dark" onClick={onConfirm}>
                Reservar <FaCalendarCheck />
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ReservaModal;

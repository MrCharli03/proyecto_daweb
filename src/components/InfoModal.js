import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const InfoModal = ({ show, onClose, title, message }) => (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
        <Modal.Header className='bg-info justify-content-center'>
            <Modal.Title style={{ fontWeight: 'bold' }}>{title}</Modal.Title>
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

export default InfoModal;

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ show, onClose, errorMessage }) => (
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

export default ErrorModal;

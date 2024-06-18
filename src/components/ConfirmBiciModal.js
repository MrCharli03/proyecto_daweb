import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BiSolidDislike } from 'react-icons/bi';

const ConfirmBiciModal = ({ show, onClose, onConfirm, message, motivo }) => {
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

export default ConfirmBiciModal;

import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { BiSolidDislike } from 'react-icons/bi';

const BajaBiciModal = ({ show, onHide, motivo, setMotivo, mostrarConfirmBajaBici }) => {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header className="justify-content-center">
                <Modal.Title style={{ fontWeight: 'bold' }}>Dar bici de baja</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Motivo</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={motivo} 
                            placeholder='Motivo' 
                            onChange={(e) => setMotivo(e.target.value)} 
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='justify-content-center'>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={mostrarConfirmBajaBici}>
                    <BiSolidDislike /> <span style={{ marginLeft: '5px' }}>Dar de baja bici</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BajaBiciModal;

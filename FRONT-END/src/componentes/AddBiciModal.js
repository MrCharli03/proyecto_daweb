import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPlusCircleFill } from 'react-icons/bs';

const AddBiciModal = ({ show, onHide, modelo, setModelo, onConfirm }) => (
    <Modal show={show} onHide={onHide} centered backdrop="static">
        <Modal.Header className="justify-content-center">
            <Modal.Title style={{ fontWeight: 'bold' }}>Agregar Bici</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formModelo">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control type="text" placeholder='Modelo' value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
            <Button variant="secondary" onClick={onHide}>
                Cancelar
            </Button>
            <Button className='custom-button' onClick={onConfirm}>
                Agregar <BsPlusCircleFill />
            </Button>
        </Modal.Footer>
    </Modal>
);

export default AddBiciModal;

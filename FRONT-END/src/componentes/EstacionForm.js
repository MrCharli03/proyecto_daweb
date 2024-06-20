import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsFillPencilFill, BsPlusCircleFill } from 'react-icons/bs';

const EstacionForm = ({
    show,
    onHide,
    title,
    nombre,
    setNombre,
    numPuestos,
    setNumPuestos,
    codPostal,
    setCodPostal,
    lat,
    setLat,
    lng,
    setLng,
    onSubmit,
    submitText,
    isEdit
}) => (
    <Modal show={show} onHide={onHide} centered backdrop="static">
        <Modal.Header className="justify-content-center">
            <Modal.Title style={{ fontWeight: 'bold' }}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formNumPuestos">
                    <Form.Label>Número de Puestos</Form.Label>
                    <Form.Control type="number" value={numPuestos} min="3" onChange={(e) => setNumPuestos(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formCodPostal">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control type="text" value={codPostal} onChange={(e) => setCodPostal(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formLat">
                    <Form.Label>Latitud</Form.Label>
                    <Form.Control type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formLng">
                    <Form.Label>Longitud</Form.Label>
                    <Form.Control type="text" value={lng} onChange={(e) => setLng(e.target.value)} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
            <Button variant="secondary" onClick={onHide}>
                Cancelar
            </Button>
            <Button className='custom-button' onClick={onSubmit}>
                 {isEdit ? <BsFillPencilFill /> : <BsPlusCircleFill />} <span style={{ marginLeft: '5px' }}> {submitText} </span>
            </Button>
        </Modal.Footer>
    </Modal>
);

export default EstacionForm;

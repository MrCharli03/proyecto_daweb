import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Registro = () => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState(null);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <Container>
            <br />
            <Row>
                <Col>
                    <h1>Registro</h1>
                </Col>
            </Row>
            <br />
            <br />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="justify-content-md-center">
                    <Form.Group as={Col} md="2">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="nombre"
                        />
                        <Form.Control.Feedback type="invalid">Introduce tu nombre</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="apellidos"
                        />
                        <Form.Control.Feedback type="invalid">Introduce tus apellidos</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <DatePicker
                            selected={birthDate}
                            onChange={(date) => setBirthDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="Selecciona una fecha"
                            required
                        />
                    </Form.Group>
                </Row>
                <br />
                <Row className="justify-content-md-center">
                    <Form.Group as={Col} md="3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="alguien@ejemplo.com"
                        />
                        <Form.Control.Feedback type="invalid">Introduce un email</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="contraseña"
                        />
                        <Form.Control.Feedback type="invalid">Introduce un contraseña</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <br />
                <Button variant="secondary" onClick={handleBackClick} style={{ marginRight: '10px' }}>
                    Volver Atrás
                </Button>
                <Button type="submit">Registrar</Button>
            </Form>
        </Container>
    );
}

export default Registro;

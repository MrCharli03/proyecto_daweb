import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../styles/Login.css';

const Login = () => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

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
            <br/>
            <Row>
                <Col>
                    <h1>Login</h1>
                </Col>
            </Row>
            <br/>
            <br/>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="justify-content-md-center">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="alguien@ejemplo.com"
                        />
                        <Form.Control.Feedback type="invalid">Introduce un email</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <br/>
                <Row className="justify-content-md-center">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="contraseña"
                        />
                        <Form.Control.Feedback type="invalid">Introduce un contraseña</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <br/>
                <Button variant="secondary" onClick={handleBackClick} style={{ marginRight: '10px' }}>
                    Volver Atrás
                </Button>
                <Button type="submit">Login</Button>
            </Form>
        </Container>
    );
}

export default Login;

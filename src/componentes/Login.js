import React from 'react';
import { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import '../styles/Login.css';

const Login = () => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
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
                <Button type="submit">Submit form</Button>
            </Form>
        </Container>
    );
}

export default Login;
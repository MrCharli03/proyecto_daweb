import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Registro.css';

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

    const handleLoginClick = () => {
        navigate('/auth/login');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
                <Card.Body>
                    <h1 className="text-center">Registro</h1>
                    <br />
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label className="text-start w-100">Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="nombre"
                            />
                            <Form.Control.Feedback type="invalid">Introduce tu nombre</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formApellidos">
                            <Form.Label className="text-start w-100">Apellidos</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="apellidos"
                            />
                            <Form.Control.Feedback type="invalid">Introduce tus apellidos</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formFechaNacimiento">
                            <Form.Label className="text-start w-100">Fecha de Nacimiento</Form.Label>
                            <DatePicker
                                selected={birthDate}
                                onChange={(date) => setBirthDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control w-100"
                                placeholderText="Selecciona una fecha"
                                required
                            />
                            <Form.Control.Feedback type="invalid">Selecciona una fecha</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formEmail">
                            <Form.Label className="text-start w-100">Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="alguien@ejemplo.com"
                            />
                            <Form.Control.Feedback type="invalid">Introduce un email</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formContraseña">
                            <Form.Label className="text-start w-100">Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="contraseña"
                            />
                            <Form.Control.Feedback type="invalid">Introduce una contraseña</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <div className="d-flex flex-column gap-2">
                            <Button variant="secondary" onClick={handleBackClick}>
                                Volver Atrás
                            </Button>
                            <Button type="submit" variant="primary">
                                Registrar
                            </Button>
                            <Button variant="link" onClick={handleLoginClick}>
                                ¿Ya tienes una cuenta? Inicia sesión
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Registro;

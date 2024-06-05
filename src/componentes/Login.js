import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
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

    const handleGitHubLogin = () => {
        // Add your GitHub login logic here
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
                <Card.Body>
                    <h1 className="text-center">Login</h1>
                    <br/>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="alguien@ejemplo.com"
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce un email
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br/>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="contraseña"
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce una contraseña
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br/>
                        <div className="d-flex flex-column gap-2">
                            <Button type="submit" variant="primary">
                                Login
                            </Button>
                            <div className="separator d-flex align-items-center">
                                <span className="line flex-grow-1"></span>
                                <span className="mx-2">o</span>
                                <span className="line flex-grow-1"></span>
                            </div>
                            <Button variant="dark" onClick={handleGitHubLogin} className="github-button">
                                <FaGithub /> Login with GitHub
                            </Button>
                            <Button variant="link" onClick={handleRegisterClick}>
                                ¿No tienes una cuenta? Regístrate
                            </Button>
                            <Button variant="secondary" onClick={handleBackClick}>
                                Volver Atrás
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;

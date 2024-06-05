import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await fetch('http://localhost:8090/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok || Object.keys(data).length === 0) {
                    throw new Error('Error en la solicitud de login');
                }

                sessionStorage.setItem('jwtToken', data.token);

                console.log("Login existoso: ", data);
                // Aquí puedes guardar el token en el almacenamiento local o en el estado de la aplicación
                // y redirigir al usuario a la página correspondiente

                //navigate('/');
            } catch (error) {
                console.error('Error en el login', error);
                setError('Error en el login. Por favor, inténtalo de nuevo.');
            }
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
        <div className="d-flex justify-content-center align-items-center min-vh-100 fondo">
            <Card className="p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '500px' , margin: '5%'}}>
                <Card.Body>
                    <h1 className="text-center">Login</h1>
                    <br/>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="alguien@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

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
                sessionStorage.setItem('userRole', data.rol);

                console.log("Login exitoso: ", data);

                navigate('/principal');
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
        /*// Abre una nueva ventana para la autenticación con GitHub
        const width = 600, height = 600;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);

        window.open(
            'http://localhost:8090/auth/oauth2', 
            '_blank', 
            `width=${width},height=${height},top=${top},left=${left}`
        );*/
        window.location.href = 'http://localhost:8090/auth/oauth2';
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const base64Credenciales = params.get('credenciales');

        if (base64Credenciales) {
            const jsonResponse = atob(base64Credenciales);
            const { token, rol } = JSON.parse(jsonResponse);

            console.log("Token:", token);
            console.log("Rol:", rol);

            if (token) {
                sessionStorage.setItem('jwtToken', token);
                sessionStorage.setItem('userRole', rol);
                navigate('/principal');
            }
        }
    }, [location, navigate]);

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 fondo">
            <Card className="p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '500px', margin: '5%' }}>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Col, Row, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Registro.css';

const Registro = () => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState(null);
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [exitoMessage, setExitoMessage] = useState('');
    const [showExitoDialog, setShowExitoDialog] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
        } else {
            try {
                const formattedDate = birthDate ? birthDate.toISOString().split('T')[0] : '';
    
                const userData = {
                    dni: dni,
                    nombreCompleto: nombre,
                    username: email,
                    idOAuth: "",
                    fechaNacimiento: formattedDate,
                    telefono: telefono,
                    password: password
                };
    
                const registerResponse = await fetch(`http://localhost:5000/usuarios/register`, { // Cambiar a 5000
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
    
                if (registerResponse.status === 204) {
                    setExitoMessage('Registro exitoso');
                    setNombre('');
                    setDni('');
                    setTelefono('');
                    setEmail('');
                    setPassword('');
                    setBirthDate(null);
                    setValidated(false);
                    setShowExitoDialog(true);
                } else if (registerResponse.status === 400) {
                    setMessage('Error en el registro. Por favor, inténtalo de nuevo.');
                }
    
            } catch (error) {
                setMessage('Error en la conexión o en el servidor.');
            }
        }
    };
    
    const handleBackClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/auth/login');
    };

    useEffect(() => {
        const handleWheel = (event) => {
            if (document.activeElement.type === 'number') {
                document.activeElement.blur();
            }
        };
        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const ExitoModal = ({ show, onClose, message }) => {
        return (
            <Modal show={show} onHide={onClose} centered backdrop="static" size="sm">
                <Modal.Header className="bg-success justify-content-center">
                    <Modal.Title style={{ fontWeight: 'bold', color: '#fff' }}>{message}</Modal.Title>
                </Modal.Header>
                <Modal.Footer className="bg-success justify-content-center">
                    <Button variant="dark" onClick={handleBackClick}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 fondo">
            <Card className="p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '500px', margin: '0%' }}>
                <Card.Body>
                    <h1 className="text-center">Registro</h1>
                    <br />
                    {message && <p className={message.includes('Error') ? "text-danger text-center" : "text-success text-center"}>{message}</p>}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label className="text-start w-100">Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Nombre Completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">Introduce tu nombre</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Row>
                            <Col>
                                <Form.Group controlId="formDni">
                                    <Form.Label className="text-start w-100">Dni</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Dni"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">Introduce tu dni</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formFechaNacimiento">
                                    <Form.Label className="text-start w-100">Fecha Nacimiento</Form.Label>
                                    <DatePicker
                                        selected={birthDate}
                                        onChange={(date) => setBirthDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control w-100"
                                        placeholderText="yyyy-MM-dd"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Selecciona una fecha</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Form.Group controlId="formTelefono">
                            <Form.Label className="text-start w-100">Telefono</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                className='no-spinner'
                                placeholder="123456789"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">Introduce un telefono</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formEmail">
                            <Form.Label className="text-start w-100">Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="alguien@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete='username'
                            />
                            <Form.Control.Feedback type="invalid">Introduce un email</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formContraseña">
                            <Form.Label className="text-start w-100">Contraseña</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='current-password'
                            />
                            <Form.Control.Feedback type="invalid">Introduce una contraseña</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <div className="d-flex flex-column gap-2">
                            <Button variant="secondary" onClick={handleBackClick}>
                                Volver Atrás
                            </Button>
                            <Button type="submit" variant="primary" >
                                Registrar
                            </Button>
                            <Button variant="link" onClick={handleLoginClick}>
                                ¿Ya tienes una cuenta? Inicia sesión
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <ExitoModal
                show={showExitoDialog}
                onClose={() => setShowExitoDialog(false)}
                message={exitoMessage}
            />
        </div>

    );
}

export default Registro;

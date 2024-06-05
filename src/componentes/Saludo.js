import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/MainContent.css'; 

const Saludo = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Recuperar el rol del usuario desde sessionStorage
        const userRole = sessionStorage.getItem('userRole');

        if (userRole === 'Gestor') {
            setMessage('Hola Gestor');
        } else {
            setMessage('Hola Usuario');
        }
    }, []);

    return (
        <div className="main-content">
            <Container>
                <Row className="mb-4">
                    <Col className="py-3">
                        <h1 className="title">{message}</h1>
                    </Col>
                </Row>
            </Container>

        </div>
    );
}

export default Saludo;
import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-light py-4">
      <Container>
        <Row className="links">
          <Col md={3}>
            <h5>Citybike</h5>
            <div>Mapa del sitio</div>
          </Col>
          <Col md={3}>
            <h5>Comunidad</h5>
            <div>Eco ciudad</div>
          </Col>
          <Col md={3}>
            <h5>Nuestros contactos:</h5>
            <div>citybike...@email</div>
            <div>Tel: ...</div>
          </Col>
          <Col md={3}>
            <h5>Idioma:</h5>
            <Form.Control as="select">
              <option>Español</option>
              <option>Inglés</option>
              <option>Francés</option>
            </Form.Control>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

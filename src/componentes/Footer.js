import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer py-4">
      <Container>
        <Row className="links">
          <Col md={3}>
            <h5>Citybike</h5>
            <div>Mapa del sitio</div>
            <div>Acerca de</div>
            <div>Politica de privacidad</div>
          </Col>
          <Col md={3}>
            <h5>Comunidad</h5>
            <div>Foro citybike</div>
          </Col>
          <Col md={3}>
            <h5>Nuestros contactos:</h5>
            <div>citybike@mail.com</div>
            <div>Tel: 968727345 </div>
          </Col>
          <Col md={3}>
            <h5>Idioma:</h5>
            <Form.Select as="select">
              <option>Español</option>
              <option>Inglés</option>
              <option>Francés</option>
            </Form.Select>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

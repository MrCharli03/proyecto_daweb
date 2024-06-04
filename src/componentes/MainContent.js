import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import '../styles/MainContent.css'; // Descomenta esta línea para importar los estilos
import ImageEstacion from '../images/aparcarBici.jpg'
import ImageBici from '../images/biciCiudad.jpg'
import ImageCatedral from '../images/catedral.jpg'

const MainContent = () => {
  return (
    <Container className="main-content">
      <Row className="mb-4">
        <Col>
          <h1 className="py-3">Bienvenido a CityBike</h1>
        </Col>
      </Row>
      <Row className="images mb-4">
        <Col md={4}>
          <Image src={ImageEstacion} thumbnail />
        </Col>
        <Col md={4}>
          <Image src={ImageBici} thumbnail />
        </Col>
        <Col md={4}>
          <Image src={ImageCatedral} thumbnail />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <p className="py-3">Empieza a moverte sostenible con nosotros</p>
        </Col>
      </Row>
    </Container>
  );
}

export default MainContent;

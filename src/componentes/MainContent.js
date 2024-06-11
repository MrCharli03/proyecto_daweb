import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import ImageEstacion from '../images/aparcarBici.jpg'
import ImageBici from '../images/biciCiudad.jpg'
import ImageCatedral from '../images/catedral.jpg'
import '../styles/MainContent.css';

const MainContent = () => {
  return (
    <div className="main-content">
      <Container>
        <Row className="mb-4">
          <Col className="py-3">
            <h1 className="title">Bienvenido a CityBike</h1>
          </Col>
        </Row>
        <Row className="mb-4">
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
        <Row>
          <Col className="py-3">
            <p className='subtitle'>Alquila tu bici y recorre todas las ciudades visitando sitios de interés por todas las estaciones de CityBike.</p>
            <p className='subtitle'> ¿A qué esperas? Ve a tu estación más cercana, viaja, disfruta y visita.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainContent;

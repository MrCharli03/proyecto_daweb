import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
//import '../styles/MainContent.css';
import ImageEstacion from '../images/aparcarBici.jpg'
import ImageBici from '../images/biciCiudad.jpg'
import ImageCatedral from '../images/catedral.jpg'

const MainContent = () => {
  return (
    <Container className="main-content">
      <Row>
        <Col>
          <h1>Bienvenido a CityBike</h1>
        </Col>
      </Row>
      <Row className="images">
        <Col md={4}>
          <Card className="img-placeholder">
            <Image src={ImageEstacion} thumbnail />
          </Card>
        </Col>
        <Col md={4}>
          <Card className="img-placeholder">
            <Image src={ImageBici} thumbnail />
          </Card>
        </Col>
        <Col md={4}>
          <Card className="img-placeholder">
            <Image src={ImageCatedral} thumbnail />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Empieza a moverte sostenible con nosotros</p>
        </Col>
      </Row>
    </Container>
  );
}

export default MainContent;

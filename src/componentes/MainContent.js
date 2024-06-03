import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
//import '../styles/MainContent.css';

const MainContent = () => {
  return (
    <Container className="main-content">
      <Row>
        <Col>
          <h1>Bienvenido a CITYBIKE</h1>
        </Col>
      </Row>
      <Row className="images">
        <Col md={4}>
          <Card className="img-placeholder">
            <Card.Body>img</Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="img-placeholder">
            <Card.Body>img</Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="img-placeholder">
            <Card.Body>img</Card.Body>
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

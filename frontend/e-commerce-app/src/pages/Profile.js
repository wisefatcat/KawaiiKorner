import React, { useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import UserPromotion from "../components/UserPromotion"; // Import UserPromotion component
import UserContext from "../UserContext";
import ChangePassword from "../components/ChangePassword";

export default function Profile() {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container style={{ padding: "30px 0" }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h2">
              {user.isAdmin ? "Admin Profile" : "User Profile"}
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>First Name:</strong>
                </Col>
                <Col md={8}>{user.firstName}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Last Name:</strong>
                </Col>
                <Col md={8}>{user.lastName}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <strong>Email:</strong>
                </Col>
                <Col md={8}>{user.email}</Col>
              </Row>
              <Button variant="primary" onClick={handleShow}>
                Change Password
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {user.isAdmin && (
        <div style={{ marginTop: "20px" }}>
          {" "}
          {/* Add margin-top for space */}
          <UserPromotion />
        </div>
      )}
      {/* Render the UserPromotion component only if user is admin */}
      <ChangePassword show={showModal} handleClose={handleClose} />
    </Container>
  );
}

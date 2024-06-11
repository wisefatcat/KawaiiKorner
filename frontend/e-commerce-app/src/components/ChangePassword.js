// ChangePassword.js

import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ChangePassword({ show, handleClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "New password and confirm password do not match",
        icon: "error",
      });
      return;
    }

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/update-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Something went wrong");
          });
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Password updated successfully",
          icon: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Something went wrong. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Change Password
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

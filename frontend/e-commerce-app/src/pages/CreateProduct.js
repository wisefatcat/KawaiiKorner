import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { postApi } from "../utils/api";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    postApi("products", {
      name: name,
      description: description,
      price: price,
      isActive: isActive,
    })
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Product Created",
            text: "The product has been created successfully!",
          });
          navigate("/products");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while creating the product.",
        });
      });

    // Clear form fields
    setName("");
    setDescription("");
    setPrice("");
    setIsActive(true);
  };

  if (!user.isAdmin) {
    return null; // Render nothing if the user is not an admin
  }

  return (
    <div>
      <h1 className="my-5 text-center">Add Product</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-5">
          Submit
        </Button>
      </Form>
    </div>
  );
}

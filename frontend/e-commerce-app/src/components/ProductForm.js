import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, price });
  };

  return (
    <div>
      <h1 className="my-5 text-center">
        {product ? "Edit Product" : "Add Product"}
      </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <div
          style={{
            padding: "30px 0",
            width: "100%",
            display: "flex",
            placeContent: "end",
            gap: "5px",
          }}
        >
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;

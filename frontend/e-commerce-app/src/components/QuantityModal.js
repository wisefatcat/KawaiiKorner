// QuantityModal.js
import React, { useState } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";

const QuantityModal = ({ show, onHide, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(quantity);
    setQuantity(1); // Reset quantity after adding to cart
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Quantity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuantityModal;

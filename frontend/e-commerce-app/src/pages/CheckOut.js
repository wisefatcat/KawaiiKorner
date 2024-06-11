import React, { useEffect, useState } from "react";
import { Button, Container, Table, FormControl, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getApi } from "../utils/api";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const data = await getApi("cart");
    if (data.error) {
      Swal.fire("Error", data.error, "error");
    } else {
      setCart(data.cart || { cartItems: [], totalPrice: 0 });
    }
  };

  const handleShowModal = (productId, quantity) => {
    setSelectedProduct(productId);
    setQuantity(quantity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleQuantityChange = async () => {
    if (quantity < 1) return;

    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/cart/updateQuantity`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ productId: selectedProduct, quantity }),
        }
      );

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        fetchCart();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/cart/${productId}/removeFromCart`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        fetchCart();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/cart/clearCart`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        fetchCart();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const handleOrderHistory = async () => {
    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        setShowOrderHistoryModal(true);
        setOrderHistory(data.orders);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const handleCloseOrderHistoryModal = () => {
    setShowOrderHistoryModal(false);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/orders/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cartId: cart._id }),
        }
      );

      const data = await response.json();

      if (data.message === "Order created successfully") {
        Swal.fire("Success", "Your order has been placed!", "success");
        navigate("/userorders");
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Container style={{ textAlign: "center" }}>
        <h1 className="my-5 text-center">Checkout</h1>
        <Table
          striped
          bordered
          hover
          style={{
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.cartItems.length > 0 ? (
              cart.cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price || 0).toFixed(2)}</td>
                  <td>${(item.subtotal || 0).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleShowModal(item.productId, item.quantity)
                      }
                    >
                      Change Quantity
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveProduct(item.productId)}
                      style={{ marginLeft: "5px" }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Your cart is empty.
                </td>
              </tr>
            )}
            {cart.cartItems.length > 0 && (
              <tr>
                <td colSpan="3">
                  <strong>Total</strong>
                </td>
                <td colSpan="2">
                  <strong>${(cart.totalPrice || 0).toFixed(2)}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div>
            <Button
              variant="danger"
              onClick={handleClearCart}
              disabled={cart.cartItems.length === 0}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Clear Cart
            </Button>
            <Button
              variant="Primary"
              onClick={handleOrderHistory}
              style={{
                marginLeft: "10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Order History
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={cart.cartItems.length === 0}
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Checkout
          </Button>
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Change Quantity</Modal.Title>
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
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleQuantityChange}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showOrderHistoryModal}
          onHide={handleCloseOrderHistoryModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Order History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {orderHistory && orderHistory.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        <ul>
                          {order.productsOrdered.map((product) => (
                            <li key={product.productId}>
                              {product.productName} - {product.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No orders found.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOrderHistoryModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

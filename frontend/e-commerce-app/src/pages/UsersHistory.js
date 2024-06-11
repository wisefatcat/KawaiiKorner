import React, { useState, useEffect } from "react";
import { getApi } from "../utils/api";
import Swal from "sweetalert2";
import { Container, Table } from "react-bootstrap";

const UsersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = () => {
    getApi("orders/all-orders")
      .then((data) => {
        if (data.error) {
          Swal.fire("Error", data.error, "error");
          setErrorMessage(data.error);
        } else {
          setOrders(data.orders);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
        setErrorMessage("Error fetching orders");
      });
  };

  return (
    <Container className="my-4">
      <h1>Users Order History</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : orders.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Products</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId.email}</td>
                <td>{order._id}</td>
                <td>{new Date(order.orderedOn).toLocaleString()}</td>
                <td>
                  <ul>
                    {order.productsOrdered.map((product) => (
                      <li key={product.productId}>
                        {product.quantity} x {product.productName}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No order history available.</p>
      )}
    </Container>
  );
};

export default UsersHistory;

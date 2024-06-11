import React, { useEffect, useState } from "react";
import { getApi } from "../utils/api";
import Swal from "sweetalert2";
import { Container, Table } from "react-bootstrap";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = () => {
    getApi("orders/my-orders")
      .then((data) => {
        if (data.error) {
          Swal.fire("Error", data.error, "error");
          setErrorMessage(data.error);
        } else if (data.message === "No orders found for the user") {
          setOrders([]);
          setErrorMessage("No orders made");
        } else {
          setOrders(data.orders);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        setIsLoading(false);
        setErrorMessage("Error fetching order history");
      });
  };

  return (
    <Container className="my-4">
      <h1>Order History</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : orders.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Products</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.orderedOn).toLocaleString()}</td>
                <td>
                  <ul className="list-unstyled">
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

export default OrderHistory;

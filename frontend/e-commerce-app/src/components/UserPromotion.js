import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import UserContext from "../UserContext";
import { getApi } from "../utils/api";
import Swal from "sweetalert2";

const UserPromotion = () => {
  const { user } = useContext(UserContext);
  const [adminUsers, setAdminUsers] = useState([]);
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [error, setError] = useState(null); // Add state for error handling

  useEffect(() => {
    if (user.isAdmin) {
      fetchAdminUsers();
      fetchNonAdminUsers();
    }
  }, [user]);

  const fetchAdminUsers = async () => {
    try {
      const data = await getApi("users/admins");
      setAdminUsers(data.users);
      setError(null); // Reset error state if successful
    } catch (error) {
      console.error("Error fetching admin users:", error);
      setError("Failed to fetch admin users. Please try again."); // Set error message
    }
  };

  const fetchNonAdminUsers = async () => {
    try {
      const data = await getApi("users/non-admins");
      setNonAdminUsers(data.users);
      setError(null); // Reset error state if successful
    } catch (error) {
      console.error("Error fetching non-admin users:", error);
      setError("Failed to fetch non-admin users. Please try again."); // Set error message
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/setAsAdmin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        Swal.fire("Success", "User promoted to admin successfully", "success");
        fetchNonAdminUsers(); // Refresh the list of non-admin users
      } else {
        const data = await response.json();
        Swal.fire("Error", data.error || "Failed to promote user", "error");
      }
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      Swal.fire("Error", "Error promoting user to admin", "error");
    }
  };

  const handleDemoteToUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/setAsUser`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        Swal.fire(
          "Success",
          "User demoted to non-admin successfully",
          "success"
        );
        fetchAdminUsers(); // Refresh the list of admin users
      } else {
        const data = await response.json();
        Swal.fire("Error", data.error || "Failed to demote user", "error");
      }
    } catch (error) {
      console.error("Error demoting user to non-admin:", error);
      Swal.fire("Error", "Error demoting user to non-admin", "error");
    }
  };

  return (
    <Card className="shadow">
      <Card.Header as="h2">Manage Users</Card.Header>
      <Card.Body>
        {error ? (
          <p>{error}</p> // Display error message if there's an error
        ) : (
          <div>
            <h3>Admin Users</h3>
            {adminUsers.length > 0 ? (
              adminUsers.map((adminUser) => (
                <Row key={adminUser._id} className="mb-3 align-items-center">
                  <Col md={6}>
                    <strong>
                      {adminUser.firstName} {adminUser.lastName}
                    </strong>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="danger"
                      onClick={() => handleDemoteToUser(adminUser._id)}
                    >
                      Demote to User
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <p>No admin users found.</p>
            )}
            <hr />
            <h3>Non-Admin Users</h3>
            {nonAdminUsers.length > 0 ? (
              nonAdminUsers.map((nonAdminUser) => (
                <Row key={nonAdminUser._id} className="mb-3 align-items-center">
                  <Col md={6}>
                    <strong>
                      {nonAdminUser.firstName} {nonAdminUser.lastName}
                    </strong>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="success"
                      onClick={() => handlePromoteToAdmin(nonAdminUser._id)}
                    >
                      Promote to Admin
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <p>No non-admin users found.</p>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserPromotion;

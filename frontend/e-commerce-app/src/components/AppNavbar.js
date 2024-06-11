import React, { useContext, useState, useEffect } from "react";
import { Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserContext from "../UserContext";
import accountIcon from "../images/account.svg";
import orderIcon from "../images/order.svg";
import cartIcon from "../images/cart.svg";
import profileIcon from "../images/profile.svg";
import logoutIcon from "../images/logout.svg";

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowOffcanvas(false);
  }, [location]);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-dark fixed-top"
      style={{
        background: "rgb(122,100,81)",
        background:
          "linear-gradient(90deg, rgba(122,100,81,0.9318102240896359) 0%, rgba(40,35,31,0.861782212885154) 22%, rgba(118,92,61,1) 100%)",
      }}
    >
      <div className="container-fluid pl-5 pr-5">
        <Navbar.Brand as={Link} to="/" className="ml-5">
          KawaiiKorner
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto mr-5 pr-5">
            <Nav.Link as={NavLink} to="/" className="nav-item home p-2">
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/products"
              className="nav-item products p-2"
            >
              Products
            </Nav.Link>
            {user && user.id ? (
              <Button
                variant="primary"
                onClick={toggleOffcanvas}
                className="nav-item p-2"
                style={{ backgroundColor: "#765C3D", border: "none" }}
              >
                <img
                  src={accountIcon}
                  alt="Account"
                  width="30"
                  height="30"
                  style={{ filter: "invert(0.8)", marginRight: "5px" }}
                />
                Account
              </Button>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-item p-2">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="nav-item p-2">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
      {user && user.id && (
        <Offcanvas
          show={showOffcanvas}
          onHide={closeOffcanvas}
          placement="end"
          style={{
            backgroundColor: "#765C3D",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Offcanvas.Header closeButton style={{ borderBottomColor: "#fff" }}>
            <Offcanvas.Title style={{ color: "#fff" }}>Account</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ color: "#fff", padding: "20px" }}>
            <div
              style={{ borderBottom: "1px solid #fff", marginBottom: "10px" }}
            ></div>
            <Nav className="flex-column">
              <Nav.Link
                as={NavLink}
                to={user.isAdmin ? "/adminorders" : "/userorders"}
                className="nav-item"
                style={{ marginBottom: "10px" }}
              >
                <img
                  src={orderIcon}
                  alt="Order History"
                  width="20"
                  height="20"
                  style={{ filter: "invert(0.8)", marginRight: "5px" }}
                />
                Order History
              </Nav.Link>
              {!user.isAdmin && (
                <Nav.Link
                  as={NavLink}
                  to="/checkout"
                  className="nav-item"
                  style={{ marginBottom: "10px" }}
                >
                  <img
                    src={cartIcon}
                    alt="Cart"
                    width="20"
                    height="20"
                    style={{ filter: "invert(0.8)", marginRight: "5px" }}
                  />
                  Cart
                </Nav.Link>
              )}
              <Nav.Link
                as={NavLink}
                to="/profile"
                className="nav-item"
                style={{ marginBottom: "10px" }}
              >
                <img
                  src={profileIcon}
                  alt="Profile"
                  width="20"
                  height="20"
                  style={{ filter: "invert(0.8)", marginRight: "5px" }}
                />
                Profile
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/logout"
                className="nav-item"
                style={{ marginBottom: "10px" }}
              >
                <img
                  src={logoutIcon}
                  alt="Logout"
                  width="20"
                  height="20"
                  style={{ filter: "invert(0.8)", marginRight: "5px" }}
                />
                Logout
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Navbar>
  );
}

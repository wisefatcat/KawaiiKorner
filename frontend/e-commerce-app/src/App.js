import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import CheckOut from "./pages/CheckOut"; // Corrected import statement for CheckOut
import OrderHistory from "./pages/OrderHistory"; // Import the OrderHistory component
import UsersHistory from "./pages/UsersHistory"; // Import the UsersHistory component
import Error from "./pages/Error";
import { Container } from "react-bootstrap";
import "./App.css";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser({
        ...JSON.parse(userString),
        id: JSON.parse(userString)._id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <div className="app-container">
          <AppNavbar />
          <Container fluid className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/checkout" element={<CheckOut />} />{" "}
              {/* Updated route for CheckOut */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/userorders" element={<OrderHistory />} />
              <Route path="/adminorders" element={<UsersHistory />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;

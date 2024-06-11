import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import styles from "../css/Login.module.scss";

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    // Prevents page redirection via form submission
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.access !== "undefined") {
          localStorage.setItem("token", data.access);
          localStorage.setItem("user", JSON.stringify(data.result));
          // invoked the retrieveUserDetails function providing the token to be used to retrieve user details.
          // retrieveUserDetails(data.access);

          setUser({
            id: data.result._id,
            isAdmin: data.result.isAdmin,
          });
          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Kawaii Korner",
          });
        } else {
          Swal.fire({
            title: "Authentication failed",
            icon: "error",
            text: "Check your login details and try again",
          });
        }
      });
    // Clear input fields after submission
    setEmail("");
    setPassword("");
  }

  // const retrieveUserDetails = (token) => {
  //     fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
  //         headers: {
  //             "Authorization": `Bearer ${token}`
  //         }
  //     })
  //         .then(res => res.json())
  //         .then(data => {
  //             console.log(data);

  //             setUser({
  //                 id: data.user._id,
  //                 isAdmin: data.user.isAdmin
  //             });

  //         });
  // }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return user.id !== null ? (
    <Navigate to="/" />
  ) : (
    <div
      className={styles.backdrop}
      style={{
        padding: "30px 0",
        width: "100%",
        display: "flex",
        placeContent: "center",
        gap: "5px",
      }}
    >
      {" "}
      <div className={styles.overlayImage}></div>
      <div className={styles.bg}>
        <Form
          className={styles.form}
          onSubmit={(e) => authenticate(e)}
          style={{ minWidth: "500px" }}
        >
          <h1 className="my-5 text-center" id={styles.segment}>
            Login
          </h1>
          <Form.Group controlId="userEmail">
            <Form.Control
              className={styles.input}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Control
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="sm"
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
            <Button type="submit" id={styles.submitBtn} className="btn btn-sm">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

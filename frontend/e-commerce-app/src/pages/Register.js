import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../css/Register.module.scss";

export default function Register() {
  const { user } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  function registerUser(e) {
    e.preventDefault();

    fetch(
      `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNo: mobileNo,
          password: password,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Registered Successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");

          Swal.fire({
            title: "Registration Successful",
            icon: "success",
            text: "You can now login with your new account",
          });
        } else if (data.error === "Email already registered") {
          Swal.fire({
            title: "Registration failed",
            icon: "error",
            text: "Email already registered",
          });
        } else if (data.error === "Invalid email format") {
          Swal.fire({
            title: "Registration failed",
            icon: "error",
            text: "Invalid email format",
          });
        } else if (data.error === "Invalid mobile number format") {
          Swal.fire({
            title: "Registration failed",
            icon: "error",
            text: "Invalid mobile number format",
          });
        } else if (
          data.error ===
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        ) {
          Swal.fire({
            title: "Registration failed",
            icon: "error",
            text: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
          });
        } else {
          Swal.fire({
            title: "Registration failed",
            icon: "error",
            text: "Something went wrong.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Registration failed",
          icon: "error",
          text: "Something went wrong. Please try again.",
        });
      });
  }

  const isFormValid = () => {
    return (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      mobileNo.length === 11
    );
  };

  useEffect(() => {
    setIsActive(isFormValid());
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  if (user.id !== null) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.overlayImage}></div>
      <div className={styles.bg}>
        <Form onSubmit={registerUser} className={styles.form}>
          <h1 className="my-5 text-center dark" id={styles.segment}>
            Register
          </h1>

          <Form.Group controlId="firstName">
            {/* <Form.Label>First Name:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            {/* <Form.Label>Last Name:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="email">
            {/* <Form.Label>Email:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="mobileNo">
            {/* <Form.Label>Mobile No:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="text"
              placeholder="Enter 11 Digit No."
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="password">
            {/* <Form.Label>Password:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            {/* <Form.Label>Confirm Password:</Form.Label> */}
            <Form.Control
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Button
              type="submit"
              className="btn btn-sm"
              id={styles.submitBtn}
              disabled={!isActive}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

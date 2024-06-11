import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Modal, FormControl } from "react-bootstrap";
import UserContext from "../UserContext";
import { postApi } from "../utils/api";
import Swal from "sweetalert2";
import styles from "../css/ProductCard.module.scss";

const importAll = (requireContext) => {
  return requireContext.keys().map(requireContext);
};

const images = importAll(
  require.context("../images/plushies", false, /\.(png|jpe?g|svg)$/)
);

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const ProductCard = ({ product, onEdit, onToggleStatus }) => {
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    setRandomImage(getRandomImage());
  }, []);

  const addToCart = async () => {
    try {
      const data = await postApi("cart/addToCart", {
        productId: product._id,
        quantity: quantity ?? 1,
      });
      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        Swal.fire("Success", data.message, "success");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const handleAddToCartClick = () => {
    if (user.id === null) {
      setShowLoginModal(true);
    } else {
      addToCart();
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Card
        style={{
          backgroundImage: `url(${randomImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "18rem",
          margin: "1rem",
          minHeight: "30vh",
          maxHeight: "30vh",
        }}
        className={styles.card}
      >
        <Card.Body className={styles.overlay}>
          <div className={styles.items}></div>
          <div className={`${styles.items} ${styles.head}`}>
            <p>{product.name}</p>
            <hr />
          </div>
          <Card.Text>{product.description}</Card.Text>
          <div className={`${styles.items} ${styles.price}`}>
            Price: ${parseInt(product.price ?? 0).toFixed(2)}
          </div>
          <div className={`${styles.items} ${styles.cart}`}>
            {user.isAdmin ? (
              <>
                <Button
                  className={styles.edit}
                  className="btn btn-md btn-info"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  id={styles.toggleBtn}
                  variant={product.isActive ? "danger" : "success"}
                  onClick={() => onToggleStatus(product)}
                  className="btn-sm"
                >
                  {product.isActive ? "Deactivate" : "Activate"}
                </Button>
              </>
            ) : (
              <div className={styles.cartControls}>
                <FormControl
                  className={styles.quantityInput}
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                  disabled={user.isAdmin === null}
                />
                <Button
                  className="btn btn-sm"
                  id={styles.addToCartBtn}
                  onClick={handleAddToCartClick}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showLoginModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please Log In or Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to log in or register to add products to your cart.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Return to Products
          </Button>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/login")}
          >
            Log In
          </Button>
          <Button
            variant="success"
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;

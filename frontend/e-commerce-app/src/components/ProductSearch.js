import React, { useState, useEffect, useContext } from "react";
import { Form, Container, Row, Col, Button, InputGroup } from "react-bootstrap";
import styles from "../css/ProductSearch.module.css"; // Import CSS module styles
import UserContext from "../UserContext";
import { getApi } from "../utils/api";

const ProductSearch = ({ products, onSearch }) => {
  const { user } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    handleSearchChange();
  }, [searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    setFilteredProducts(products); // Initialize filtered products with the original list of products
  }, [products]);

  const fetchAllProducts = async () => {
    try {
      let endpoint = "products/active";
      if (user.isAdmin) {
        endpoint = "products/all";
      }
      const data = await getApi(endpoint);
      setAllProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = () => {
    // Determine whether to perform a search by name or by price
    if (searchTerm.trim() !== "") {
      // Search by name
      handleSearchByName();
    } else if (minPrice.trim() !== "" || maxPrice.trim() !== "") {
      // Search by price
      handleSearchByPrice();
    } else {
      // If no search query, reset the filtered products
      setFilteredProducts(allProducts);
      onSearch(allProducts);
    }
  };

  const handleSearchByName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/searchByName`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: searchTerm }),
        }
      );
      const data = await response.json();
      setFilteredProducts(data.products || []);
      onSearch(data.products || []);
    } catch (error) {
      console.error("Error searching by name:", error);
    }
  };

  const handleSearchByPrice = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/searchByPrice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ minPrice, maxPrice }),
        }
      );
      const data = await response.json();
      setFilteredProducts(data.filteredProducts || []);
      onSearch(data.filteredProducts || []);
    } catch (error) {
      console.error("Error searching by price:", error);
    }
  };

  const handleClear = () => {
    // Clear all fields and reset filtered products
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setFilteredProducts(allProducts); // Reset filtered products to all products
    onSearch(allProducts); // Trigger the onSearch function with all products
  };

  return (
    <Container className={styles.container}>
      <Form>
        <Row className={styles.inlineForm}>
          <Col xs="auto">
            <InputGroup>
              <Form.Control
                className={`${styles.input} ${styles.nameInput}`}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search product name"
              />
            </InputGroup>
          </Col>
          <Col xs="auto">
            <InputGroup>
              <InputGroup.Text className={styles.sign}>₱</InputGroup.Text>
              <Form.Control
                className={styles.input}
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Minimum price"
              />
            </InputGroup>
          </Col>
          <Col xs="auto">
            <InputGroup>
              <InputGroup.Text className={styles.sign}>₱</InputGroup.Text>
              <Form.Control
                className={styles.input}
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maximum price"
              />
            </InputGroup>
          </Col>
          <Col xs="auto">
            <Button
              className={styles.button}
              variant="dark"
              onClick={handleClear}
            >
              CLEAR
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProductSearch;

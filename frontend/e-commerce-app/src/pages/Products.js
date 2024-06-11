import React, { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import ProductSearch from "../components/ProductSearch"; // Import ProductSearch component
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { getApi } from "../utils/api";
import styles from '../css/ProductsBackground.module.css'

const Products = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, [user.id, loading]);

  const fetchAllProducts = async () => {
    try {
      let endpoint = "products/active";
      if (user.isAdmin) {
        endpoint = "products/all";
      }
      const data = await getApi(endpoint);
      setProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleSearch = (filtered) => {
    setFilteredProducts(filtered); // Update the filtered products based on the search results
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsCreating(true);
  };

  const handleToggleProductStatus = async (product) => {
    if (!user.id) {
      setShowLoginPrompt(true);
      return;
    }

    const updatedStatus = product.isActive ? "archive" : "activate";
    try {
      const response = await fetch(
        `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/products/${product._id}/${updatedStatus}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === product._id ? { ...p, isActive: !p.isActive } : p
          )
        );
        Swal.fire(
          "Success",
          `Product ${updatedStatus}d successfully`,
          "success"
        );
      } else {
        console.error("Failed to toggle product status");
        Swal.fire("Error", `Failed to ${updatedStatus} product`, "error");
      }
    } catch (error) {
      console.error(`Error ${updatedStatus}ing product:`, error);
      Swal.fire("Error", `Error ${updatedStatus}ing product`, "error");
    }
  };

  const handleCreateOrUpdateProduct = async (productData) => {
    const method = editingProduct ? "PATCH" : "POST";
    const url = editingProduct
      ? `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/products/${editingProduct._id}/update`
      : `http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b2/products`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setIsCreating(false);
        setEditingProduct(null);
        setProducts((prevProducts) => {
          if (editingProduct) {
            return prevProducts.map((p) =>
              p._id === updatedProduct._id ? updatedProduct : p
            );
          }
          return [...prevProducts, updatedProduct];
        });
        Swal.fire(
          "Success",
          `Product ${editingProduct ? "updated" : "created"} successfully`,
          "success"
        );
      } else {
        const data = await response.json();
        console.error("Failed to create or update product");
        Swal.fire(
          "Error",
          data.error || "Failed to create or update product",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating or updating product:", error);
      Swal.fire("Error", "Error creating or updating product", "error");
    }
  };

  return (
    <div className={styles.texture}>
      <h1 className="mt-5" id={styles.title}>Products</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {user.isAdmin && (
            <button id={styles.createButton}
              onClick={() => setIsCreating(true)}
              className="btn btn-primary"
            >
              Create New Product
            </button>
          )}
          <dialog
            open={isCreating}
            style={{ zIndex: 10, maxWidth: "700px", width: "100%" }}
          >
            <ProductForm
              product={editingProduct}
              onSubmit={handleCreateOrUpdateProduct}
              onCancel={() => {
                setIsCreating(false);
                setEditingProduct(null);
              }}
            />
          </dialog>

          {showLoginPrompt && (
            <div className="login-prompt">
              <p>Please log in or register to add products to the cart.</p>
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/login")}
              >
                Log In
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => (window.location.href = "/register")}
              >
                Register
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setShowLoginPrompt(false)}
              >
                Close
              </button>
            </div>
          )}

          <ProductSearch products={products} onSearch={handleSearch} />

          <div className={styles.catalog} style={{ display: "flex", flexWrap: "wrap" }}>
            {filteredProducts &&
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEditProduct}
                  onToggleStatus={handleToggleProductStatus}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;

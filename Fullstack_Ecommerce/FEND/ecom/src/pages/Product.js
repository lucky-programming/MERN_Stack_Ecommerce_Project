import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Context from "../componenets/Context";

const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reletedPro, setreletedPro] = useState([]);
  const obj = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const fromAdminDashboard = location.state?.fromAdminDashboard || false;
  const isAdmin = obj.state.role === "admin";

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/singleProduct/${slug}`);
        if (res.data && res.data.product) {
          setProduct(res.data.product);
          toast.success(
            obj.state.role === "user"
              ? "😍 Nice Collection! Enjoy E-Shopping 🛍️"
              : fromAdminDashboard
              ? "👨‍💼 Hey Admin! You can handle the product from here."
              : "👁️ Admin Preview Mode"
          );

          const { _id: pid, category } = res.data.product;
          if (category && category._id) {
            getSimilarProducts(pid, category._id);
          }
        } else {
          toast.error("❌ Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("⚠️ Oops! Internal issue. Please try again later.");
      }
    };

    if (slug) getSingleProduct();
  }, [slug, obj.state.role, fromAdminDashboard]);

  const getSimilarProducts = async (pid, cid) => {
    try {
      const res = await axios.get(`http://localhost:5000/similar-products/${pid}/${cid}`);
      setreletedPro(res.data?.products || []);
    } catch (err) {
      console.log("Error fetching similar products", err);
    }
  };

  const handleProduct = () => {
    navigate(`/adminDashboard/updateProducts/${slug}`);
  };

  const addToCart = async () => {
    setAddingToCart(true);

    if (!obj.state._id) {
      toast.error("🔒 User not logged in! Please log in to add items to the cart.");
      setAddingToCart(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/addToCart`, {
        userId: obj.state._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        photo: product.photo,
        quantity: 1,
        description: product.description,
        category: product.category,
      });

      if (res.data.message === "Product already exists in the cart.") {
        toast.warning("⚠️ " + res.data.message);
        setAddedToCart(true);
      } else if (res.data.success) {
        toast.success("🛒 " + (res.data.message || "Product Added to The Cart!"));
        setAddedToCart(true);

        const existingCart = Array.isArray(obj.state.cart) ? obj.state.cart : [];
        const updatedCart = [...existingCart, res.data.product];

        obj.CartLt({ cart: updatedCart });
        localStorage.setItem("userData", JSON.stringify({ ...obj.state, cart: updatedCart }));
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("🚫 Failed to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-5 product-detail-page">
      {product ? (
        <>
          <h2 className="text-center text-primary fw-bold mb-4">🛍️ Product Showcase</h2>
          <div className="row bg-white shadow rounded-4 p-4 mb-5">
            <div className="col-md-5 d-flex justify-content-center align-items-center">
              <img
                src={product.photo ? `http://localhost:5000/getPhoto/${product._id}` : "https://via.placeholder.com/400"}
                alt={product.name}
                className="img-fluid rounded-4 shadow product-image"
              />
            </div>
            <div className="col-md-7">
              <h1 className="fw-bold text-primary mb-3">✨ {product.name}</h1>

              <h5 className="mt-4 fw-semibold text-secondary">📋 Product Overview</h5>
              <p className="fs-5 text-muted mb-2"><strong>📂 Category:</strong> {product.category?.name || "N/A"}</p>

              <h5 className="mt-4 fw-semibold text-secondary">🧾 Price & Stock Info</h5>
              <p className="fs-5 mb-2"><strong>💰 Price:</strong> ₹{product.price || "N/A"}</p>
              <p className="fs-5 mb-2"><strong>📦 Stock:</strong> {product.quantity || "N/A"}</p>

              <h5 className="mt-4 fw-semibold text-secondary">📝 Description</h5>
              <ul className="text-muted">
                {product.description.split("\n").map((line, index) =>
                  line.trim() ? <li key={index}>🔹 {line.trim()}</li> : null
                )}
              </ul>

              <h5 className="mt-4 fw-semibold text-secondary">🧃 Actions & Choices</h5>
              <div className="mt-3">
                {isAdmin && (
                  <button className="btn btn-outline-warning me-2 rounded-pill px-4" onClick={handleProduct}>
                    🛠️ Handle Item
                  </button>
                )}
                {addedToCart ? (
                  <button className="btn btn-outline-success me-2 rounded-pill px-4" onClick={() => navigate("/cart")}>
                    ✅ Go to Cart
                  </button>
                ) : (
                  <button className="btn btn-success me-2 rounded-pill px-4" onClick={addToCart} disabled={addingToCart}>
                    {addingToCart ? "⏳ Adding..." : "🛒 Add to Cart for Payment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <h5 className="text-center text-muted">⏳ Loading product details...</h5>
      )}

      {/* Similar Products Section */}
      <div className="similar-products mt-5">
        <h2 className="text-center text-secondary fw-bold mb-4">🧩 You Might Also Like</h2>
        <div className="row g-4">
          {reletedPro.length > 0 ? (
            reletedPro.map((item) => (
              <div
                key={item._id}
                className="col-6 col-sm-4 col-md-4 col-lg-2 d-flex justify-content-center"
              >
                <div
                  className="card product-similar-card shadow-sm border-0 rounded-4"
                  onClick={() => navigate(`/product/${item.slug}`)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    width: "100%",
                    maxWidth: "200px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <img
                    src={`http://localhost:5000/getPhoto/${item._id}`}
                    alt={item.name}
                    className="card-img-top rounded-top-4"
                    style={{
                      height: "160px",
                      objectFit: "cover",
                      transition: "opacity 0.4s ease",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="card-body text-center">
                    <h6 className="card-title text-dark fw-semibold mb-1">
                      ✨ {item.name?.slice(0, 20)}
                    </h6>
                    <p className="card-text text-success fw-bold">₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">🚫 No similar products found. Thoda aur explore karo yaar!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

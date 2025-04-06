import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


const Home = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getProduct");
      if (res.data.products) {
        setProducts(res.data.products);
        toast.success("Fetched products successfully. Enjoy E-shopping!");
      } else {
        toast.error("No products found.");
      }
    } catch (err) {
      toast.error("Oops! Internal issue. Please try again later.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="home-wrapper">
      <h2 className="page-title">Our Products</h2>

      <div className="row g-4 justify-content-center">
        {products.length > 0 ? (
          products.map((pro) => (
            <div
              key={pro._id}
              className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex"
            >
              <Link to={`/product/${pro.slug}`} className="w-100 text-decoration-none">
                <div className="laxman">
                  <img
                    src={`http://localhost:5000${pro.photo}`}
                    alt={pro.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                    className="product-img"
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{pro.name || "N/A"}</h5>
                    <h6 className="text-success">₹{pro.price || "N/A"}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

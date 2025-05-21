import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams(); // Category slug

  useEffect(() => {
    fetchCategoryProducts(slug);
  }, [slug]);

  const fetchCategoryProducts = async (slug) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/product-category/${slug}`);
      if (res.data?.products) {
        setProducts(res.data.products);
      } else {
        toast.info("No products found in this category.");
      }
    } catch (err) {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="container home-wrapper my-4">
      <h2 className="text-center mb-4 page-title">
        {products.length} products found in "{slug}"
      </h2>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <p>Loading...</p>
              </div>
            ) : products.slice(0, visibleCount).length > 0 ? (
              products.slice(0, visibleCount).map((product) => (
                <div
                  key={product._id}
                  className="col-6 col-md-3 col-lg-2 d-flex justify-content-center"
                >
                  <Link to={`/product/${product.slug}`} className="w-100 text-decoration-none">
                    <div className="laxman w-100">
                      <img
                        src={`http://localhost:5000/getPhoto/${product._id}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                        className="product-img"
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">
                          {product.name?.substring(0, 20) || "N/A"}
                        </h5>
                        <h6 className="text-success">₹{product.price || "N/A"}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div className="text-center mt-4">
              <button className="btn btn-dark" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

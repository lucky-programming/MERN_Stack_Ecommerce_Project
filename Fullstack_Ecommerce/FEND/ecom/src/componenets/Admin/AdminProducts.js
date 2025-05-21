import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const {slug}=useParams()
    const getAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getProduct");
        
        console.log("API Response:", res.data); // Debugging
  
        if (res.data.products) {
          setProducts(res.data.products);
          toast.success("Fetched products successfully. Enjoy E-shopping!");
        } else {
          toast.error("No products found.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Oops! Internal issue. Please try again later.");
      }
    };
  
    useEffect(() => {
      getAllProducts();
    }, []);
   
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Our Products</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.length > 0 ? (
          products.map((pro) => (
            <div key={pro._id} className="col">
              <Link to={`/product/${pro.slug}`} className="text-decoration-none">
                <div className="card shadow-sm h-100">
                  <img
                    src={`http://localhost:5000${pro.photo}`} // Corrected Image URL
                    className="card-img-top"
                    alt={pro.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150"; // Fallback image
                    }}
                    style={{ height: "250px", width: "100%", objectFit: "contain", padding: "10px" }} // ✅ Improved Image Clarity
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{pro.name || "N/A"}</h5>
                    <h6 className="text-success">₹{pro.price || "N/A"}</h6>
                    <button className="btn btn-primary mt-2 w-100">Handle Product</button>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No products found.</p>
        )}
      </div>
    </div>
  )
}

export default AdminProducts

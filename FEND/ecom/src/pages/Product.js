import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Context from "../componenets/Context";


const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  let obj=useContext(Context)
  let navigate=useNavigate()

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/singleProduct/${slug}`);
        
        if (res.data && res.data.product) {
          setProduct(res.data.product);
          toast.success(obj.state.role==="user"?"Nice Collection! Enjoy E-Shopping.":"hey Admin! You can Handle the Product from hear.")
        } else {
          toast.error("Product not found!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Oops! Internal issue. Please try again later.");
      }
    };

    if (slug) getSingleProduct();
  }, [slug,obj.state.role]);
   
  let handleProduct = () => {
    navigate(`/adminDashboard/updateProducts/${slug}`);
  };
  
  return (
    <div className="product-page">
      {product ? (
        <div className="product-container">
          {/* Left Side - Image */}
          <div className="product-image">
            <img
              src={product.photo ? `http://localhost:5000/getPhoto/${product._id}` : "https://via.placeholder.com/400"}
              alt={product.name}
              className="product-photo"/>
          </div>

          {/* Right Side - Details */}
          <div className="product-info">
            <h1 className="product-title list-group-item">{product.name}</h1>
            <hr/>
            <p className="product-category list-group-item"><strong>Category:</strong> {product.category?.name || "N/A"}</p>
            <hr/>
            <p className="product-price list-group-item"><strong>Price:</strong> ₹{product.price || "N/A"}</p>
            <hr/>
            <p className="product-desc list-group-item "><strong>Key Features</strong>{product.description}</p>
            <hr/>

            <p className="product-stock list-group-item"><strong>Stock:</strong> {product.stock || "N/A"}</p>
            <hr/>
            <div className="product-actions">
              {obj.state.role!=="admin"&&<button className="btn-add-cart">Add to Cart</button>}
              {obj.state.role!=="admin"&&<button className="btn-buy-now">Buy Now</button>}
              {obj.state.role==="admin"&&<button className="btn-Handle" onClick={handleProduct} >Handle Item</button>}
            </div>
          </div>
        </div>
      ) : (
        <h5 className="loading-text">Loading product details...</h5>
      )}
    </div>
  );
};

export default Product;

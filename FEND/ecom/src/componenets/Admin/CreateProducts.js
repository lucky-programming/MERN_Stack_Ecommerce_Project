import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Select } from "antd";
import Context from "../Context";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";


const { Option } = Select;

const CreateProducts = () => {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({
    name: "",
    photo: "",
    description: "",
    price: "",
    category: "",
    quantity: "1",
    shipping: "",
  });

  const obj = useContext(Context);
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  // console.log("Token being sent:", token); // Debugging

  // Handle input change
  const ProductHandlerFun = (e) => {
    
    setData({ ...data, [e.target.name]: e.target.value });
    let {name,value}=e.target
    if(name==="quantity"){
      value = Math.max(1, Number(value));
    }
    setData({ ...data, [name]: value });
    
  };

  // Handle category selection
  const handleCategoryChange = (value) => {
    setData({ ...data, category: value });
  };

  // Handle image selection
  const imageHandling = (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Please select a valid image file.");
      return;
    }

    setData({ ...data, photo: file });

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      if (!token) {
        console.error("No token found, skipping category fetch.");
        setMsg("Authentication error: Token missing");
        return;
      }

      const res = await axios.get("http://localhost:5000/getAllCat", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response for categories:", res.data); // Debugging

      if (res.data && Array.isArray(res.data.findCat)) {
        setCategories(res.data.findCat);
      } else {
        setCategories([]);
        console.error("Unexpected response structure:", res.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setMsg("Failed to load categories");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]); // Runs when `token` changes

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Submit product
  const newProduct = async (e) => {
    e.preventDefault();
    if (Object.values(data).some((val) => !val)) {
      setMsg("All fields are required!");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      console.log("Final Product Data:", Object.fromEntries(formData)); // Debugging

      await axios.post("http://localhost:5000/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("New Product Added.");
      setData({ name: "", photo: "", description: "", price: "", category: "", quantity: "", shipping: "" });
      setPreview(null);
    } catch (err) {
      console.log("Error in adding product:", err);
      toast.error("Error in adding product.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="product-box shadow p-4">
        <h2 className="text-center mb-4 Product-heading">Create a New Product</h2>
        <form onSubmit={newProduct}>
          {msg && <p className="alert alert-danger">{msg}</p>}

          {/* Category Selection */}
          <div className="mb-3">
            <label htmlFor="categorySelect" className="product-form-label">Select a Category</label>
            <Select
              id="categorySelect"
              showSearch
              className="pro-form-select"
              name="category"
              value={data.category || undefined} // Prevents null error
              onChange={handleCategoryChange}
              placeholder="Select a category"
              filterOption={(input, option) =>
                option?.children?.toLowerCase()?.includes(input.toLowerCase())
              }
            >
              {categories.length > 0 ? (
                categories.map((C) => (
                  <Option key={C._id} value={C._id}>{C.name}</Option>
                ))
              ) : (
                <Option disabled>No categories found</Option>
              )}
            </Select>
          </div>

          {/* Image Selection */}
          <div className="mb-3">
            <label htmlFor="imageInput" className="btn btn-danger">Select Image</label>
            <input id="imageInput" type="file" accept="image/*" name="photo" onChange={imageHandling} style={{ display: "none" }} />
          </div>

          {preview && (<div className="text-center mb-3">
            <img src={preview} alt="product_image" className="img-thumbnail product-preview"/>
            </div>
          )}

          {/* Name Input */}
          <div className="mb-3">
            <label className="p-form-label">Product Name</label>
            <input type="text" className="form-control cnt" name="name" value={data.name} onChange={ProductHandlerFun} required />
          </div>

          {/* Description Input */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className='form-control cnt' id='exampledesc' name='description' value={data.description} onChange={ProductHandlerFun} rows="4" placeholder="Enter product description"></textarea>
          </div>

          {/* Price Input */}
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control cnt" name="price" value={data.price} onChange={ProductHandlerFun} required />
          </div>

          {/* Quantity Input */}
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control cnt" name="quantity" value={data.quantity} onChange={ProductHandlerFun} required />
          </div>

          {/* Shipping Selection */}
          <div className="mb-3">
            <label className="form-label">Shipping</label>
            <Select
              id="shippingSelect"
              className="form-select"
              name="shipping"
              value={data.shipping}
              onChange={(value) => setData({ ...data, shipping: value })} // ✅ Correct handler
              placeholder="Select Shipping"
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button className="btn btn-primary w-100" type="submit">Create Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Select } from "antd";
import Context from "../Context";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateAndDeleteProduct = () => {
  const { slug } = useParams();
  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  let navigate=useNavigate()
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

  const ProductHandlerFun = (e) => {
    let { name, value } = e.target;
    if (name === "quantity") {
      value = Math.max(1, Number(value));
    }
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setData((prevData) => ({ ...prevData, category: value }));
  };

  const imageHandling = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a valid image file.");
      return;
    }
    setData((prevData) => ({ ...prevData, photo: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getAllCat", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.findCat) {
        setCategories(res.data.findCat);
      }
    } catch (err) {
      setMsg("Failed to load categories");
    }
  };

  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/singleProduct/${slug}`);
      const product = res.data.product;

      if (product) {
        setProductId(product._id);
        setData({
          name: product.name || "",
          photo: product.photo || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category?._id || "",
          quantity: product.quantity ? String(product.quantity) : "1",
          shipping: product.shipping ? "1" : "0",
        });
      } else {
        toast.error("Product not found!");
      }
    } catch (err) {
      toast.error("Error fetching product details.");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!productId) {
      return toast.error("Product ID not found.");
    }

    if (Object.values(data).some((val) => val === "")) {
      setMsg("All fields are required!");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(`http://localhost:5000/updateProduct/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product updated successfully.");
    } catch (err) {
      toast.error("Error updating product.");
    }
  };

  useEffect(() => {
    fetchCategories();
    getSingleProduct();
  }, []);
 
  let deleteProduct=async(e)=>{
    e.preventDefault()
    try{
      if(!productId){
        return toast.error("Product not Found to delete!")
      }

      let confirmDelete=window.confirm("Are you sure Want to delete the product?")
        if (!confirmDelete){
          return
        }

      let res=await axios.delete(`http://localhost:5000/deleteProduct/${productId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(res?.data?.success){
        toast.success("Product Deleted successfully.")
        setMsg(res.data.msg)
        navigate("/adminDashboard")
      }
      else{
        console.log(res.data)
        toast.error("Something went wrong in deleting the Product")
      }     
    }
    catch(err){
      console.log("error:",err)

    }

  }
  return (
    <div className="container mt-4">
      <div className="product-box shadow p-4">
        <h2 className="text-center mb-4 product-Heading">Update Product</h2>
        <form onSubmit={updateProduct}>
          {msg && <p className="alert alert-danger">{msg}</p>}

          {/* Category Selection */}
          <div className="mb-3">
            <label className="product-form-label">Select a Category</label>
            <Select
              showSearch
              className="pro-form-select"
              name="category"
              value={data.category}
              onChange={handleCategoryChange}
              placeholder="Select a category"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No categories found</Option>
              )}
            </Select>
          </div>

          {/* Image Input */}
          <div className="mb-3">
            <label htmlFor="imageInput" className="btn btn-danger ">
              Select Image
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              name="photo"
              onChange={imageHandling}
              style={{ display: "none" }}
            />
          </div>

          {/* Image Preview */}
          <div className="text-center mb-3">
            {preview ? (
              <img src={preview} alt="Preview" className="img-thumbnail product-preview" />
            ) : data.photo ? (
              <img
                src={`http://localhost:5000/getPhoto/${productId}`}
                alt="Product"
                className="img-thumbnail product-preview"
                style={{ maxHeight: "200px" }}
              />
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input type="text" className="form-control cnt" name="name" value={data.name} onChange={ProductHandlerFun} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control cnt" name="description" value={data.description} onChange={ProductHandlerFun} rows="4" />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control cnt" name="price" value={data.price} onChange={ProductHandlerFun} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control cnt" name="quantity" value={data.quantity} onChange={ProductHandlerFun} required />
          </div>

          <div className="text-center">
            <button className="btn btn-primary w-100" type="submit">
              Update Product
            </button>
            <hr/>
            <button className="btn btn-danger w-100" onClick={deleteProduct}>
              Delete Product
            </button>
            
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateAndDeleteProduct;

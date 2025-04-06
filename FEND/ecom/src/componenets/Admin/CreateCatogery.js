import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Context from "../Context";
import { useNavigate } from "react-router-dom";


const CreateCategory = () => {
  const [category, setCategory] = useState({ name: "" });
  const [cat, setCat] = useState([]);
  const [msg, setMsg] = useState("");
  let navigate=useNavigate()

  const obj = useContext(Context);

  // Retrieve token from state or localStorage
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  console.log("Token being sent:", token); // 🔍 Debugging

  // Handle input change
  const createCatFun = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // Create new category
  const createCat = async (e) => {
    e.preventDefault();
    try {
      if (category.name.trim() === "") {
        return setMsg("Please enter the new category name");
      }

      if (!token) {
        toast.error("Unauthorized: Token is missing");
        return;
      }

      let res = await axios.post("http://localhost:5000/setCategory", category, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg(res.data.msg);
      toast.success(res.data.msg);
      setCategory({ name: "" });

      // Fetch categories again after adding
      fetchCategories();
    } catch (err) {
      console.log("Error in creating category", err);
      toast.error(err.response?.data?.msg || "Error in creating category");
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      let res = await axios.get("http://localhost:5000/getAllCat");
      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        setCat(res.data);
      } else {
        const categoryArray = Object.values(res.data).find((item) => Array.isArray(item)) || [];
        setCat(categoryArray);
      }
    } catch (err) {
      console.log("Error fetching categories:", err);
      setMsg("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
   
  const deleteCat = async (categoryId) => {
    if (!token) {
      return toast.error("Unauthorized: Token is missing");
    }
  
    if (!categoryId) {
      return toast.error("Error: Category ID is missing");
    }
  
    try {
      console.log("Deleting category with ID:", categoryId);
  
      const res = await axios.delete(`http://localhost:5000/deleteCategory/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      toast.success(res.data.msg || "Category deleted successfully");
  
      // ✅ Refresh category list after deletion
      fetchCategories();
    } catch (err) {
      console.log("Error deleting category:", err);
      toast.error(err.response?.data?.msg || "Error deleting category");
    }
  };
  

    // ✅ Function to update category
    const editCat = async () => {
      navigate("/adminDashboard/edit")
     
    };
  

  return (
    <div className="container mt-4 cont1">
      <h1 className="text-center mb-4">Manage Categories</h1>

      {/* Category Form */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={createCat} className="card p-4 shadow">
            {msg && <div className="alert alert-info">{msg}</div>}

            <div className="mb-3">
              <label htmlFor="catInputCat" className="form-label">
                Create New Category
              </label>
              <input
                type="text"
                className="form-control"
                id="catInputCat"
                placeholder="Enter New Category"
                name="name"
                value={category.name}
                onChange={createCatFun}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Category Table */}
      <div className="row mt-4">
        <div className="col">
          <div className="card p-3 shadow">
            <h2 className="text-center mb-3">Category List</h2>
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Category Name</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  cat.length > 0 ? (
                    cat.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>{c.name}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-primary" onClick={editCat}>EDIT</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteCat(c._id)}>DELETE</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-danger">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;

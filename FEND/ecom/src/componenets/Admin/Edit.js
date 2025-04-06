import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Context from "../Context";

const CreateCategory = () => {
  const [category, setCategory] = useState({ name: "" });
  const [cat, setCat] = useState([]);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null); // Track category being edited
  

  const obj = useContext(Context);
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  console.log("Token being sent:", token); // Debugging

  // Handle input change
  const createCatFun = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
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

  // Handle category creation or update
  const updateCategory = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!category.name.trim()) {
      return setMsg("Please enter the category name");
    }

    if (!token) {
      toast.error("Unauthorized: Token is missing");
      return;
    }

    try {
      if (editId) {
        // Update existing category
        let res = await axios.put(`http://localhost:5000/updateCategory/${editId}`, { name: category.name }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success(res.data.msg);
      } else {
        // Create new category
        let res = await axios.post("http://localhost:5000/createCategory", { name: category.name }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success(res.data.msg);
      }

      setCategory({ name: "" });
      setEditId(null);
      fetchCategories(); // Refresh category list
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.response?.data?.msg || "Error processing request");
    }
  };

  // When "Edit" is clicked, set the category in the input field
  const startEdit = (id, name) => {
    setEditId(id);
    setCategory({ name }); // Auto-fill input with old name
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{editId ? "Edit Category" : "Create Category"}</h1>

      {/* Category Form */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={updateCategory} className="card p-4 shadow">
            {msg && <div className="alert alert-info">{msg}</div>}

            <div className="mb-3">
              <label htmlFor="catInputCat" className="form-label">
                {editId ? "Edit Category" : "Enter Category"}
              </label>
              <input
                type="text"
                className="form-control"
                id="catInputCat"
                name="name"
                value={category.name}
                onChange={createCatFun}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {editId ? "Update" : "Submit"}
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
                  {cat.length > 0 ? (
                    cat.map((c, index) => (
                      <tr key={c._id || index}>
                        <td>{index + 1}</td>
                        <td>{c.name}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-primary" onClick={() => startEdit(c._id, c.name)}>EDIT</button>
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

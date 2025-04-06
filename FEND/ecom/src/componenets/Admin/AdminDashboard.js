import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  // State for sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid adminDashboard">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`left-info ${isSidebarOpen ? "open" : ""}`}>
        <h4>Admin Dashboard</h4>
        <hr />
        <p className="sidebar-desc">
          Manage categories, products, and users from here.
        </p>

        <ul className="list-group">
          <li className="list-group-item">
            <Link to="" onClick={toggleSidebar}>🏠 Home</Link>
          </li>
          <hr />
          <li className="list-group-item">
            <Link to="profile" onClick={toggleSidebar}>👤 Profile</Link>
          </li>
          <hr />
          <li className="list-group-item">
            <Link to="createCategory" onClick={toggleSidebar}>📂 Create Category</Link>
          </li>
          <hr />
          <li className="list-group-item">
            <Link to="createProduct" onClick={toggleSidebar}>🛍️ Create Products</Link>
          </li>
          <hr />
          
          <li className="list-group-item">
            <Link to="usersInfo" onClick={toggleSidebar}>👥 Users</Link>
          </li>
        </ul>
      </div>

      {/* Right Content */}
      <div className="right-info">
        <Outlet />
        <div className="container mt-4">add something if you want</div>
      </div>
    </div>
  );
};

export default AdminDashboard;

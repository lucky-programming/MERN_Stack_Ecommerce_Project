import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();

  return (
    <div className="container-fluid adminDashboard d-flex p-0" style={{ minHeight: "100vh" }}>
      {/* Sidebar Toggle */}
      <button
        className="btn btn-outline-dark m-2 d-md-none"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`left-info bg-light p-3 ${isSidebarOpen ? "open" : "d-none d-md-block"}`} style={{ width: "250px", minHeight: "100vh" }}>
        <h4 className="fw-bold mb-3">🛠️ Admin Dashboard</h4>
        <p className="sidebar-desc text-muted">Manage categories, products, and users from here.</p>
        <hr />

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <Link to="." className={location.pathname === "/dashboard/admin" ? "fw-bold text-primary" : ""} onClick={toggleSidebar}>
              👤 Profile
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="createCategory" onClick={toggleSidebar}>📂 Create Category</Link>
          </li>
          <li className="list-group-item">
            <Link to="createProduct" onClick={toggleSidebar}>🛍️ Create Products</Link>
          </li>
          <li className="list-group-item">
            <Link to="adminProducts" onClick={toggleSidebar}>📦 Products</Link>
          </li>
          <li className="list-group-item">
            <Link to="usersInfo" onClick={toggleSidebar}>👥 Users</Link>
          </li>
          <li className="list-group-item">
            <Link to="ordersInfo" onClick={toggleSidebar}>🧾 Orders</Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="right-info flex-grow-1 p-3 bg-white shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

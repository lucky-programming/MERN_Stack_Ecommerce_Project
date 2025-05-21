import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Context from "../Context";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const obj = useContext(Context);

  useEffect(() => {
    axios.get(`http://localhost:5000/getSingleUser/${obj.state.email}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log("Error in fetching details...", err);
      });
  }, [obj.state.email]);

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
        <h4 className="sidebar-title">
          {user.firstname} {user.lastname}
        </h4>
        <hr />
        <p className="sidebar-desc">
          Manage your profile and orders from here.
        </p>

        <ul className="list-group">
          <li className="list-group-item">
            <Link to="." onClick={toggleSidebar}>👤 Profile</Link>
          </li>
          <hr />
          <li className="list-group-item">
            <Link to="orders" onClick={toggleSidebar}>🧾 Orders</Link>
          </li>
          <hr />
          <li className="list-group-item">
            <Link to="wishList" onClick={toggleSidebar}>❤️ Wish List</Link>
          </li>
        </ul>
      </div>

      {/* Right Content */}
      <div className="right-info">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;

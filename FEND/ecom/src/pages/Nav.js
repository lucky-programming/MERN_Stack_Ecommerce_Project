import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { MdShoppingBag } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import Context from "../componenets/Context";

const Nav = () => {
  const obj = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  
  // Close dropdown on screen resize or click outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };
    
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" ref={navbarRef}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <MdShoppingBag /> E-Shop
        </Link>

        {/* Search Bar - Responsive */}
        <form className="d-flex search-bar">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        {/* Toggle Button with Animation */}
        <button
          className="btn menu-button d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Navbar Links with Improved Dropdown */}
        <div className={`navbar-collapse ${menuOpen ? "show" : "d-none d-lg-flex"}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/" 
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            
            {!obj.state.token && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/reg" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/cat" 
                onClick={() => setMenuOpen(false)}
              >
                Category
              </Link>
            </li>
            
            {obj.state.token && (
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/cart" 
                  onClick={() => setMenuOpen(false)}
                >
                  Cart (0)
                </Link>
              </li>
            )}
            
            {obj.state.token && obj.state.role === "admin" && (
              <li className="nav-item dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="adminDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ADMIN
                </button>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/adminDashboard" 
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/logout" 
                      onClick={() => setMenuOpen(false)}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            
            {obj.state.token && obj.state.role === "user" && (
              <li className="nav-item dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  USER
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/userDashboard" 
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/logout" 
                      onClick={() => setMenuOpen(false)}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
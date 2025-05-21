import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdShoppingBag } from "react-icons/md";
import { FaBars, FaHome, FaTimes } from "react-icons/fa";
import Context from "../componenets/Context";
import axios from "axios";
import useCategory from "../componenets/hook/useCategory";

const Nav = () => {
  const obj = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const categories = useCategory();

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (keyword.trim()) {
      axios
        .get("http://localhost:5000/main-search", { params: { keyword } })
        .then((res) => {
          setSuggestions(res.data.slice(0, 5));
          setShowDropdown(true);
        })
        .catch((err) => {
          console.error("Suggestion error:", err.response?.data || err.message);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    localStorage.setItem("searchKeyword", keyword);
    navigate(`/search?keyword=${keyword}`);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (text) => {
    localStorage.setItem("searchKeyword", text);
    setKeyword(text);
    navigate(`/search?keyword=${text}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShowDropdown(false);
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
        <Link className="navbar-brand" to="/">
          <MdShoppingBag /> E-Shop
        </Link>

        <form className="d-flex position-relative search-bar w-100 w-lg-auto" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>

          {showDropdown && suggestions.length > 0 && (
  <ul
    className="list-group position-absolute w-100 shadow rounded"
    style={{
      top: "100%",
      left: 0,
      zIndex: 1000,
      backgroundColor: "white",
      color: "black",
      maxHeight: "250px",
      overflowY: "auto",
    }}
  >
    {suggestions.map((s) => (
      <li
        key={s._id}
        className="list-group-item list-group-item-action"
        onClick={() => handleSuggestionClick(s.name)}
        style={{
          cursor: "pointer",
          backgroundColor: "white",
          color: "black",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
        }}
      >
        {s.name}
      </li>
    ))}
  </ul>
)}

        </form>

        <button
          className="btn menu-button d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <div className={`navbar-collapse ${menuOpen ? "show" : "d-none d-lg-flex"}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>
                HOME
              </Link>
            </li>

            {!obj.state.token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/reg" onClick={() => setMenuOpen(false)}>
                    REGISTER
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setMenuOpen(false)}>
                    LOGIN
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item dropdown">
              <button className="btn dropdown-toggle" type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                CATEGORIES
              </button>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                {categories?.length > 0 ? (
                  categories.map((c) => (
                    <li key={c._id}>
                      <Link className="dropdown-item" to={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}>
                        {c.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No categories available</li>
                )}
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart" onClick={() => setMenuOpen(false)}>
                CART
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {obj.state.cart?.length || 0}
                </span>
              </Link>
            </li>

            {obj.state.token && obj.state.role === "admin" && (
              <li className="nav-item dropdown">
                <button className="btn dropdown-toggle" type="button" id="adminDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  ADMIN
                </button>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item" to="/adminDashboard" onClick={() => setMenuOpen(false)}>
                      DASHBOARD
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/logout" onClick={() => setMenuOpen(false)}>
                      LOGOUT
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {obj.state.token && obj.state.role === "user" && (
              <li className="nav-item dropdown">
                <button className="btn dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  USER
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/userDashboard" onClick={() => setMenuOpen(false)}>
                      DASHBOARD
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/logout" onClick={() => setMenuOpen(false)}>
                      LOGOUT
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

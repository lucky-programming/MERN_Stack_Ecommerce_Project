import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchingBar.css"; // Optional for dropdown styling

const SearchingBar = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.trim()) {
        console.log("Searching keyword:", keyword); // ✅ Check what keyword is sent
        axios.get("http://localhost:5000/main-search", {
          params: { keyword }
        })
        .then(res => {
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
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <form className="d-flex search-bar" onSubmit={handleSearch}>
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
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 z-3 suggestion-dropdown">
          {suggestions.map((s) => (
            <li
              key={s._id}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(s.name)}
              style={{ cursor: "pointer" }}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchingBar;

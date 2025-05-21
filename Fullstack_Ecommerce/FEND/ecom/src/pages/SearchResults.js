import { Checkbox, Radio } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Price } from "./Price";
import { toast } from "react-toastify";
import { Filter } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keywordFromURL = queryParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState(JSON.parse(localStorage.getItem("searchChecked")) || []);
  const [radio, setRadio] = useState(JSON.parse(localStorage.getItem("searchRadio")) || []);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState(
    keywordFromURL || localStorage.getItem("searchKeyword") || ""
  );

  // Save filters to localStorage on change
  useEffect(() => {
    localStorage.setItem("searchKeyword", searchKeyword);
    localStorage.setItem("searchChecked", JSON.stringify(checked));
    localStorage.setItem("searchRadio", JSON.stringify(radio));
  }, [searchKeyword, checked, radio]);

  // Run search whenever keywordFromURL changes
  useEffect(() => {
    setSearchKeyword(keywordFromURL || "");
    fetchCategories();

    if (checked.length || radio.length) {
      filterSearchProducts(keywordFromURL || "");
    } else {
      searchProducts(keywordFromURL || "");
    }
  }, [keywordFromURL]);

  // Trigger filter search if user changes filter manually
  useEffect(() => {
    if (checked.length || radio.length) {
      filterSearchProducts(searchKeyword);
    }
  }, [checked, radio]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getAllCat");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Category loading failed");
    }
  };

  const searchProducts = async (keyword) => {
    try {
      const res = await axios.get("http://localhost:5000/main-search", {
        params: { keyword },
      });

      setProducts(res.data);
      setTotal(res.data.length);
    } catch (err) {
      console.log("Search error:", err);
      toast.error("Search failed");
    }
  };

  const filterSearchProducts = async (keyword) => {
    try {
      let categoryParam = checked[0] || "";
      let priceParam = radio.length === 2 ? `${radio[0]},${radio[1]}` : "";

      const res = await axios.get("http://localhost:5000/main-search", {
        params: {
          keyword,
          category: categoryParam,
          price: priceParam,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.error("Filter search error:", err.response?.data || err.message);
      toast.error("Filter failed");
    }
  };

  const handleFilterChange = (value, id) => {
    const all = value ? [...checked, id] : checked.filter((c) => c !== id);
    setChecked(all);
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    localStorage.removeItem("searchChecked");
    localStorage.removeItem("searchRadio");
    searchProducts(searchKeyword);
  };

  return (
    <div className="container home-wrapper my-4">
      <h2 className="text-center mb-4 page-title">Search Results</h2>

      <div className="d-md-none text-end mb-3">
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
        >
          <Filter size={18} className="me-2" />
          Filter By
        </button>
      </div>

      <div className="row mb-4">
        <div className={`col-md-3 mb-3 filter-box ${showFiltersMobile ? "show-mobile" : ""}`}>
          <h5>Search By Category</h5>
          {(showAllCategories ? categories : categories.slice(0, 5)).map((c) => (
            <Checkbox
              key={c._id}
              checked={checked.includes(c._id)}
              onChange={(e) => handleFilterChange(e.target.checked, c._id)}
            >
              {c.name}
            </Checkbox>
          ))}
          {categories.length > 5 && (
            <p className="see-toggle mt-1" onClick={() => setShowAllCategories(!showAllCategories)}>
              {showAllCategories ? "See Less" : "See More"}
            </p>
          )}

          <h5 className="mt-4">Filter by Price</h5>
          <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
            {(showAllPrices ? Price : Price.slice(0, 5)).map((p, index) => (
              <Radio key={index} value={p.array}>{p.name}</Radio>
            ))}
          </Radio.Group>
          {Price.length > 5 && (
            <p className="see-toggle mt-1" onClick={() => setShowAllPrices(!showAllPrices)}>
              {showAllPrices ? "See Less" : "See More"}
            </p>
          )}

          <div className="mt-4 text-center">
            <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div className="col-md-9 right-homepage">
          <div className="row g-4">
            {products.length > 0 ? (
              products.map((pro) => (
                <div key={pro._id} className="col-6 col-md-4 col-lg-custom d-flex justify-content-center">
                  <Link to={`/product/${pro.slug}`} className="w-100 text-decoration-none">
                    <div className="laxman w-100">
                      <img
                        src={`http://localhost:5000/getPhoto/${pro._id}`}
                        alt={pro.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                        className="product-img"
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{pro.name?.substring(0, 20) || "N/A"}</h5>
                        <h6 className="text-success">₹{pro.price || "N/A"}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

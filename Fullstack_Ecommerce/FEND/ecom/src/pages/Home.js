import { Checkbox, Radio } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Price } from "./Price";
import { Filter } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    getTotal();
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts();
    } else {
      setProducts([]);
      setPage(1);
      getAllProducts(1);
    }
  }, [checked, radio]);

  useEffect(() => {
    if (!checked.length && !radio.length && page > 1) {
      getAllProducts(page);
    }
  }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getAllCat");
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        const categoryArray =
          Object.values(res.data).find((item) => Array.isArray(item)) || [];
        setCategories(categoryArray);
      }
    } catch (err) {
      toast.info("Failed to load categories 😔");
    }
  };

  const getAllProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/product-list/${pageNum}`);
      if (res.data?.products) {
        setProducts((prev) => pageNum === 1 ? res.data.products : [...prev, ...res.data.products]);
      }
    } catch (err) {
      toast.error("Something went wrong. Try later 😞");
    } finally {
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const data = await axios.get("http://localhost:5000/product-count");
      setTotal(data.data.total);
    } catch (err) {
      console.error("Error fetching total count");
    }
  };

  const filterProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/filter-product", {
        checked,
        radio,
      });
      if (res.data?.products) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Filter error:", err);
      toast.error("Error filtering products 😔");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
  };

  return (
    <div className="container home-wrapper my-4">
      <h2 className="text-center mb-4 page-title">🛍️ Our Products</h2>
      <hr/>

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
          <h5>🗂️ Search By Category</h5>
          <hr/>
          <p className="htext">Choose the categories you're interested in. You can select multiple options! 🏷️</p>
          <hr/>
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
              {showAllCategories ? "See Less" : "See More"} 📜
            </p>
          )}

          <h5 className="mt-4">💰 Filter by Price</h5>
          <hr/>
          <p className="htext">Select a price range to narrow down your choices. 💸</p>
          <hr/>
          <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
            {(showAllPrices ? Price : Price.slice(0, 5)).map((p) => (
              <Radio key={p._id} value={p.array}>
                {p.name}
              </Radio>
            ))}
          </Radio.Group>
          {Price.length > 5 && (
            <p className="see-toggle mt-1" onClick={() => setShowAllPrices(!showAllPrices)}>
              {showAllPrices ? "See Less" : "See More"} 📊
            </p>
          )}

          <div className="mt-4 text-center">
            <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
              Clear Filters ❌
            </button>
          </div>
        </div>

        <div className="col-md-9 right-homepage">
          <h3>🌟 Featured Products</h3>
          <div className="row g-4">
            {products.length > 0 ? (
              products.map((pro) => (
                <div
                  key={pro._id}
                  className="col-6 col-md-4 col-lg-custom d-flex justify-content-center"
                >
                  <Link
                    to={`/product/${pro.slug}`}
                    className="w-100 text-decoration-none"
                  >
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
                        <h5 className="card-title">
                          {pro.name?.substring(0, 20) || "N/A"} 🏷️
                        </h5>
                        <h6 className="text-success">₹{pro.price || "N/A"} 💸</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found 😕</p>
              </div>
            )}

            {!checked.length && !radio.length && products.length < total && (
              <div className="col-12 text-center mt-3">
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => prev + 1);
                  }}
                >
                  {loading ? "Loading... ⏳" : "Load More 🔽"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

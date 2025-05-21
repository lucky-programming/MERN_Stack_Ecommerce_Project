import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getAllCat");
      
      // Assuming the response structure is { msg: 'All Category List.', findCat: [...] }
      if (res.data && Array.isArray(res.data.findCat)) {
        setCategories(res.data.findCat);
      } else {
        toast.info("No categories found or incorrect response structure");
      }
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return categories;
};

export default useCategory;

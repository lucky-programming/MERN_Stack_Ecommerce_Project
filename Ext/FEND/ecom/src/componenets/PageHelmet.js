import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageHelmet = () => {
  const location = useLocation();

  const metaData = {
    "/": { title: "Best Offerce", description: "Welcome to our website!" },
    "/login": { title: "Login - My Ecom", description: "Login to your account." },
    "/reg": { title: "Register - My Ecom", description: "Create a new account." },
    "/cart": { title: "Cart - My Ecom", description: "Your shopping cart." },
    "/cat": { title: "Categories - My Ecom", description: "Browse our categories." },
    "/contact": { title: "Contact - My Ecom", description: "Get in touch with us." },
    "/policy": { title: "Privacy Policy - My Ecom", description: "Read our policies." },
    "/about": { title: "About Us - My Ecom", description: "Learn more about us." },
    "/profile":{title:"Profile-My Ecom",description:"Profile info"},
    "/adminDashboard":{title:"AdminDashbord-My Ecom",description:"Creat-Category"},
    "/adminDashboard/createProduct":{title:"createProduct-My Ecom",description:"createProduct"},
    "/adminDashboard/createCategory":{title:"createCategory-My Ecom",description:"CreateCategory"},
    "/adminDashboard/usersInfo":{title:"All Users-My Ecom",description:"Users information"},
    "/adminDashboard/profile":{title:"My Profile-My ecom",description:"My information"},
    "*": { title: "404 - Page Not Found", description: "Oops! This page does not exist." }
  };

  useEffect(() => {
    const { title } = metaData[location.pathname] || metaData["*"];
    document.title = title; // ✅ Update title dynamically
  }, [location]); // Runs when location changes

  return null; // No need to return any JSX
};

export default PageHelmet;

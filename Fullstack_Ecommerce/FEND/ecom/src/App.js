import { BrowserRouter, Route, Routes } from "react-router-dom"
import Nav from "./pages/Nav"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import Category from "./pages/Category"
import Footer from "./componenets/Footer"
import "./App.css"
import Contact from "./pages/Contact"
import Policy from "./pages/Policy"
import About from "./pages/About"
import PagenotFound from "./pages/PagenotFound"
import PageHelmet from "./componenets/PageHelmet"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react"
import Context from "./componenets/Context"
import Logout from "./pages/Logout"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./componenets/Profile"
import CreateCatogery from "./componenets/Admin/CreateCatogery"
import CreateProducts from "./componenets/Admin/CreateProducts"
import UserInfo from "./componenets/Admin/UserInfo"
import AdminDashboard from "./componenets/Admin/AdminDashboard"
import Orders from "./componenets/userDashboard/Orders"
import UserDashboard from "./componenets/userDashboard/UserDashboard"
import Wishlist from "./componenets/userDashboard/Wishlist"
import Edit from "./componenets/Admin/Edit"
import Product from "./pages/Product"
import UpdateAndDeleteProduct from "./componenets/Admin/UpdateAndDeleteProduct"
import AdminProducts from "./componenets/Admin/AdminProducts"
import SearchResults from "./pages/SearchResults"

// import TestCategory from "./pages/Test"
import CategoriesPage from "./pages/CategoriesPage"
import Payment from "./pages/Payment"
import ManageOrders from "./componenets/Admin/ManageOrders"


const App = () => {
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {
    _id:"",
    token: "",
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    mobile: "",
    address: "",
    profileImage:"",
    cart: [] // for updating cart lenght 
  };
  
  const [state, setState] = useState(storedUserData);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // You could add additional responsive logic here if needed
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Set initial value
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize); // ✅ Cleanup event listener
    };
  }, []);
  
  const updateState = (obj) => {
    setState({...state, ...obj});
  };

   // Add the product to the cart
  const CartLt = (product) => {
    setState((prevState) => {
      const updatedCart = [...prevState.cart, product];
      localStorage.setItem("userData", JSON.stringify({ ...prevState, cart: updatedCart }));
      return { ...prevState, cart: updatedCart };
    });
  };

  const contextValue = { "state": state, "updateState": updateState, "CartLt": CartLt };
  
  return (
    <div className="app-container">
      <BrowserRouter>
        <Context.Provider value={contextValue}>
          <Nav />
          <main className="body">
            <PageHelmet />
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path="/category/:slug" element={<CategoriesPage/>} />
              <Route path="/toPayment" element={<Payment/>}/>
              <Route path='login' element={<Login/>}/>
              <Route path='reg' element={<Register/>}/>
              <Route path='cart' element={<Cart/>}/>
              <Route path='cat' element={<Category/>}/>
              <Route path="contact" element={<Contact/>}/>
              <Route path="policy" element={<Policy/>}/>
              <Route path="about" element={<About/>}/>
              <Route path="logout" element={<Logout/>}/>
              <Route path="resetPassword" element={<ResetPassword/>}/>
              <Route path="product/:slug" element={<Product/>}/>
              <Route path="search" element={<SearchResults/>}/>

              {/* <Route path="/test-category" element={<TestCategory />} /> */}

              <Route path="*" element={<PagenotFound/>}/>
              
              {/* Admin Panel */}
              <Route path="adminDashboard" element={<AdminDashboard/>}>
                {/* <Route index element={<Home/>}/> */}
                <Route path="adminProducts" element={<AdminProducts />} />
                <Route index element={<Profile/>}/>
                <Route path="createProduct" element={<CreateProducts/>}/>
                <Route path="createCategory" element={<CreateCatogery/>}/>
                <Route path="usersInfo" element={<UserInfo/>}/>
                <Route path="ordersInfo" element={<ManageOrders/>}/>
                <Route path="edit" element={<Edit/>}/>
                <Route path="updateProducts/:slug" element={<UpdateAndDeleteProduct/>}/> 
              </Route>
              
              {/* User Menu */}
              <Route path="userDashboard" element={<UserDashboard/>}>
                <Route index element={<Profile/>}/>
                <Route path="orders" element={<Orders/>}/>
                <Route path="wishList" element={<Wishlist/>}/>
              </Route>
            </Routes>
            <ToastContainer />
          </main>
          <Footer />
        </Context.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
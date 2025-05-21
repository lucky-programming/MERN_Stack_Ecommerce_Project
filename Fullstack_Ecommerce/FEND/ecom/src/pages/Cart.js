import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Context from "../componenets/Context";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { Pointer } from "lucide-react";

const Cart = () => {
  const { slug } = useParams();
  const obj = useContext(Context);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (obj?.state?._id) {
      getCartProduct();
    }
  }, [obj?.state?._id]);

  const getCartProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart/${obj.state._id}`);
      if (res.data && Array.isArray(res.data.product)) {
        setCartId(res.data._id);
        setProducts(res.data.product);
        calculateTotalPrice(res.data.product);
      } else {
        setProducts([]);
        setTotalPrice(0);
      }
    } catch (err) {
      toast.error("Error in fetching the cart! 😔");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (products) => {
    const total = products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${obj.state._id}/${productId}`);
      await getCartProduct(); // refresh UI and recalculate totals
      toast.success("Product removed from the cart! 🗑️");
    } catch (err) {
      toast.error("Error deleting product from cart! 😢");
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await axios.patch(`http://localhost:5000/inc/${cartId}/${productId}`);
      getCartProduct();
    } catch {
      toast.error("Error increasing quantity. 😞");
    }
  };

  const decreaseQuantity = async (productId, quantity) => {
    if (quantity <= 1) {
      toast.warn("Min quantity is 1. Remove the item to delete. ⚠️");
    } else {
      try {
        await axios.patch(`http://localhost:5000/dec/${cartId}/${productId}`);
        getCartProduct();
      } catch {
        toast.error("Error decreasing quantity. 😞");
      }
    }
  };

  const toPayment = () => {
    navigate("/toPayment", { state: { cart: products, totalPrice } });
  };

  const toProduct = (slug) => {
    navigate(`/product/${slug}`);
  };

  if (loading) return <div className="text-center my-5">Loading... ⏳</div>;

  return (
    <div className="container py-4 cart-container">
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {products.length === 0 ? (
        <p className="text-center">Your cart is empty. 😕</p>
      ) : (
        <>
          <div className="cart-items">
            {products.map((item) =>
              item?.product && (
                <div key={item.product._id} className="cart-item card shadow-sm p-3 mb-4">
                  <div className="row">
                    <div className="col-md-4 col-12 mb-3 mb-md-0">
                      <img
                        src={
                          item.product.photo
                            ? `http://localhost:5000/getPhoto/${item.product._id}`
                            : "https://via.placeholder.com/400"
                        }
                        alt={item.product.name}
                        className="img-fluid rounded cart-img"
                      />
                    </div>
                    <div className="col-md-8 col-12">
                      <h5 onClick={() => toProduct(item.product.slug)} style={{ cursor: "pointer", color: "blue" }}>
                        {item.product.name} 🏷️
                      </h5>
                      <p>Price: ₹{item.product.price}</p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span>Qty: {item.quantity} </span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => decreaseQuantity(item.product._id, item.quantity)}>-</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => increaseQuantity(item.product._id)}>+</button>
                      </div>
                      <p className="mt-2">Subtotal: ₹{item.product.price * item.quantity} 💰</p>
                      <button className="btn btn-sm btn-danger mt-2" onClick={() => deleteProduct(item.product._id)}>Remove </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="total-summary-box bg-light shadow">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="mb-0">Total: ₹{totalPrice} 💸</h4>
              <button className="btn btn-success fix" onClick={toPayment}>Place Order 🛍️</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

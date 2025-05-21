import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import Context from "../componenets/Context";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], totalPrice = 0 } = location.state || {};
  const [clientToken, setClientToken] = useState(null);
  const [dropInInstance, setDropInInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const obj = useContext(Context);
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  useEffect(() => {
    const getClientToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/braintree-token");
        const { clientToken } = response.data;
        setClientToken(clientToken);
      } catch (err) {
        console.error("Failed to get client token:", err);
        toast.error("❌ Unable to connect to payment gateway");
      }
    };

    getClientToken();
  }, []);

  const handleBuy = async () => {
    try {
      if (!dropInInstance) {
        toast.warning("⚠️ Payment UI not ready. Try again.");
        return;
      }

      setLoading(true);
      const { nonce } = await dropInInstance.requestPaymentMethod();

      const response = await axios.post("http://localhost:5000/payment-process", {
        nonce,
        cart,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        toast.success("✅ Payment successful! Order placed.");
        setPaymentSuccess(true);
      } else {
        toast.error("❌ Payment failed. Try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("⚠️ Payment error. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const onInstance = (instance) => {
    setDropInInstance(instance);
  };

  const onError = (error) => {
    console.error("Braintree Drop-In Error:", error);
    toast.error("⚠️ Error with payment interface.");
  };

  // -------------------------------
  // 🎉 SUCCESS VIEW
  // -------------------------------
  if (paymentSuccess) {
    return (
      <div className="congrats-screen d-flex justify-content-center align-items-center text-center vh-100 bg-dark">
        <div className="congrats-card p-5 rounded-4 bg-success text-white shadow-lg">
          <h1 className="display-4 fw-bold mb-3">🎉 Congratulations!</h1>
          <p className="lead mb-4">✅ Your payment was successful and your order has been placed.</p>
          <button className="btn btn-light rounded-pill px-4 py-2" onClick={() => navigate("/")}>
            🏠 Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------
  // 💳 MAIN PAYMENT FORM
  // -------------------------------
  return (
    <div className="payment-container container-fluid d-flex justify-content-center align-items-center py-5 bg-light min-vh-100">
      <div className="payment-card shadow-lg p-4 rounded-4 bg-white col-11 col-md-8 col-lg-6">
        <h1 className="text-center fw-bold text-success mb-4">🛒 Welcome to Secure Checkout</h1>

        <h4 className="mb-3 text-dark border-bottom pb-2">📦 Your Items</h4>
        <div className="order-summary mb-4">
          {cart.map((item, index) => (
            <div key={index} className="border-bottom py-2">
              <h5 className="mb-1">🧺 {item.product.name}</h5>
              <p className="mb-0 small text-muted">Qty: {item.quantity} | ₹{item.product.price} each</p>
              <p className="mb-0 fw-semibold">Subtotal: ₹{item.quantity * item.product.price}</p>
            </div>
          ))}
          <h4 className="text-end mt-3 text-primary fw-bold">💰 Total: ₹{totalPrice}</h4>
        </div>

        {clientToken ? (
          <>
            <h4 className="mb-3 text-dark border-bottom pb-2">💳 Choose a Payment Method</h4>
            <div className="dropin-container mb-3">
              <DropIn
                options={{
                  authorization: clientToken,
                  paypal: { flow: "vault" },
                  card: { cardholderName: { required: true } },
                }}
                onInstance={onInstance}
                onError={onError}
              />
            </div>

            <div className="text-center">
              <button
                className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"
                onClick={handleBuy}
                disabled={loading}
              >
                {loading ? "⏳ Processing..." : "💳 Pay Now"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center mt-4 text-secondary">🔄 Loading payment gateway...</p>
        )}
      </div>
    </div>
  );
};

export default Payment;

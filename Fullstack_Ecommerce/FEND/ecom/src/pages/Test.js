// import React, { useEffect, useState, Suspense } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// // ✅ Lazy load DropInWrapper
// const DropInWrapper = React.lazy(() => import("../pages/DropInWrapper"));

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { cart = [], totalPrice = 0 } = location.state || {};

//   const [clientToken, setClientToken] = useState(null);
//   const [dropInInstance, setDropInInstance] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getClientToken = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/braintree-token");
//         const { clientToken } = response.data;

//         if (!clientToken) throw new Error("Client token not received");
//         setClientToken(clientToken);
//       } catch (err) {
//         console.error("Failed to get client token:", err);
//         toast.error("Unable to connect to payment gateway");
//       }
//     };

//     getClientToken();
//   }, []);

//   const handleBuy = async () => {
//     try {
//       if (!dropInInstance) {
//         toast.warning("Payment UI not ready. Try again.");
//         return;
//       }

//       setLoading(true);
//       const { nonce } = await dropInInstance.requestPaymentMethod();
//       console.log("Nonce generated:", nonce);

//       const response = await axios.post("http://localhost:5000/payment-process", {
//         nonce,
//         cart,
//       });

//       if (response.data.success) {
//         toast.success("Payment successful!");
//         navigate("/");
//       } else {
//         toast.error("Payment failed. Try again.");
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       toast.error("Payment error. Please check your details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h2 className="text-center mb-4">🧾 Order Summary</h2>

//       {cart.map((item, index) => (
//         <div key={index} className="border-bottom py-2">
//           <h5>{item.product.name}</h5>
//           <p>Qty: {item.quantity} | ₹{item.product.price} each</p>
//           <p>Subtotal: ₹{item.quantity * item.product.price}</p>
//         </div>
//       ))}

//       <h4 className="text-end mt-4">Total: ₹{totalPrice}</h4>

//       {clientToken ? (
//         <>
//           <div className="border p-3 mt-4">
//             <Suspense fallback={<p>Loading payment UI...</p>}>
//             <DropInWrapper clientToken={clientToken} onInstance={(instance) => {
//               setDropInInstance(instance);
//               console.log("DropIn initialized");
//             }}
//             onError={(err) => {
//               console.error("DropIn load error:", err);
//               toast.error("Payment UI failed to load");
//               }}
//               />
//             </Suspense>
//           </div>

//           <div className="text-center mt-3">
//             <button
//               className="btn btn-success px-4"
//               onClick={handleBuy}
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "Pay Now"}
//             </button>
//           </div>
//         </>
//       ) : (
//         <p className="text-center mt-4">🔄 Loading payment gateway...</p>
//       )}
//     </div>
//   );
// };

// export default Payment;








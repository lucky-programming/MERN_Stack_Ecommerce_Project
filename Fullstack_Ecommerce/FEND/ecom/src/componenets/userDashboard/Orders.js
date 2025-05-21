import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const obj = useContext(Context);
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-orderList", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
        toast.success("🎉 Here are your orders!");
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong fetching orders.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "warning";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      case "Shipped":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container py-4 orders-container">
      <h2 className="text-center fw-bold mb-4 text-white animate-title">🧾 Your Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-center text-white">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => {
          const orderTotal = order.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return (
            <div key={order._id} className="order-card mb-4 p-4 card-hover-effect animated-card bg-white rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="fw-bold mb-0 text-dark">Order #{index + 1}</h4>
                <span className="text-muted">{moment(order.createdAt).format("DD-MM-YYYY hh:mm A")}</span>
              </div>

              <p className="mb-2">
                <strong>Buyer:</strong> {order.buyer?.firstname} {order.buyer?.lastname}
              </p>

              <p className="mb-3">
                <strong>Status:</strong>{" "}
                <span className={`badge bg-${getStatusColor(order.status)}`}>{order.status}</span>
              </p>

              <div className="row gy-3">
                {order.products.map((product, idx) => {
                  const imageUrl = product.photo
                    ? product.photo.startsWith('http')
                      ? product.photo
                      : `http://localhost:5000/getPhoto/${product.product._id}`
                    : "https://via.placeholder.com/80";  // Default placeholder image

                  return (
                    <div key={idx} className="col-12">
                      <div className="d-flex flex-column flex-md-row border rounded p-3 bg-light shadow-sm product-fullwidth">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="rounded mb-2 mb-md-0 me-md-3 productsss-img"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-1">{product.name}</h6>
                          <p className="mb-1">Price: ₹{product.price}</p>
                          <p className="mb-1">Quantity: {product.quantity}</p>
                          <p className="fw-semibold">Subtotal: ₹{product.price * product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-end border-top pt-3 mt-3">
                <h5>Total: ₹{orderTotal}</h5>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;

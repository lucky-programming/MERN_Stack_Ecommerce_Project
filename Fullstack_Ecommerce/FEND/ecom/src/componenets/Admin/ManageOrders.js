import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';


const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const obj = useContext(Context);
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const token = obj?.state?.token || storedUserData.token;

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-AllOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
        toast.success("Orders fetched successfully.");
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("Error fetching orders.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
        const res = await axios.put(
            `http://localhost:5000/manage-orders/${orderId}`, // ✅ Pass orderId in the URL
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
          );
      if (res.data?.success !== false) {
        toast.success("Order status updated.");
        getOrders();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Update error", err);
      toast.error("Error updating order status.");
    }
  };

  return (
    <div className="manage-orders-page">
      <div className="parallax-bg"></div>
      <div className="overlay"></div>
      <div className="container py-4">
        <h2 className="text-center fw-bold mb-4 text-white animate-title">📦 Admin Panel: Manage Orders</h2>

        {orders?.length > 0 ? (
          orders.map((order, idx) => (
            <div
              key={order._id || idx}
              className="mb-4 p-4 card-hover-effect animated-card bg-white rounded shadow-sm"
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="fw-bold mb-0 text-dark">Order #{idx + 1}</h4>
                <span className="text-muted">{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <p className="mb-2">
                <strong>Buyer:</strong> {order?.buyer?.firstname} {order?.buyer?.lastname}
              </p>

              <div className="mb-3">
                <label className="fw-semibold me-2">Status:</label>
                <select
                  className="form-select w-auto d-inline-block select-status"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  {["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="row gy-3">
                {order.products.map((item, index) => {
                  const imageUrl = item.photo
                    ? item.photo.startsWith("http")
                      ? item.photo
                      : `http://localhost:5000/getPhoto/${item.product?._id || item._id}`
                    : "https://via.placeholder.com/100";

                  return (
                    <div key={index} className="col-12">
                      <div className="d-flex flex-column flex-md-row border rounded p-3 bg-light shadow-sm product-fullwidth">
                        <img
                          src={imageUrl}
                          alt={item?.name}
                          className="rounded mb-2 mb-md-0 me-md-3 product-img"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-1">{item?.name}</h6>
                          <p className="mb-1">Qty: {item?.quantity} | ₹{item?.price}</p>
                          <small className="text-muted">{item?.description}</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "productModel" },
        quantity: Number,
        name: String,
        price: Number,
        photo: String,
        description: String,
        category: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
          name: String,
        },
      }
    ],
    payment: {},
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("OrderList", orderSchema);

module.exports = orderModel;

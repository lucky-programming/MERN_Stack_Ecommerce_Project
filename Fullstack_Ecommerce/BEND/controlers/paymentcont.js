const braintree=require("braintree");
const orderModel = require("../models/paymentModel");
const cartModel = require("../models/cartModel");

// Braintree gateway setup
var gateway = new braintree.BraintreeGateway({
  environment:  braintree.Environment.Sandbox,
  merchantId:   'gz4p3bggh3qwz3kz',
  publicKey:    'hsfrpdvb83dpdzhw',
  privateKey:   '98c321cf6890b23fc642c61df6fde2d3'
});
// Generate Braintree client token
const generateTokenCont = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) return res.status(500).send({ success: false, error: err });

      // ✅ Send only the clientToken string
      res.send({ clientToken: response.clientToken, success: true });
    });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).send({ success: false, error: "Failed to generate client token" });
  }
};


// Process payment
const processPayment = async (req, res) => {
  console.log("Processing payment with nonce:", req.body.nonce); // Log nonce to verify it's received correctly
  try {
    const { nonce } = req.body;

    // Get user's cart from DB
    const userCart = await cartModel.findOne({ user: req.user._id });
    if (!userCart || userCart.product.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total amount
    let total = 0;
    userCart.product.forEach((item) => {
      total += item.price * item.quantity;
    });

    // Proceed with Braintree transaction
    gateway.transaction.sale(
      {
        amount: total.toFixed(2),
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async (err, result) => {
        if (result?.success) {
          console.log("Transaction successful:", result);
          // Create new order
          const newOrder = new orderModel({
            products: userCart.product,
            payment: result,
            buyer: req.user._id,
          });
          await newOrder.save();

          // Empty the user's cart
          await cartModel.findOneAndUpdate({ user: req.user._id }, { $set: { product: [] } });

          res.json({ ok: true });
        } else {
          console.error("Transaction failed:", err || result.message);
          res.status(500).json({ error: err || result.message });
        }
      }
    );
  } catch (error) {
    console.log("Payment error:", error);
    res.status(500).send({ error: "Payment failed" });
  }
};

const getOrders = async (req, res) => {
  try {
    let orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products.product", "name price photo") // Populate product details including photo
      .populate("buyer", "firstname lastname");

    res.json({ success: true, orders });
    console.log(orders)
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      success: false,
      msg: "Error in fetching orders.",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product", "name price photo")
      .populate("buyer", "firstname lastname")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({
      success: false,
      msg: "Error in fetching all orders.",
    });
  }
};

// Update order status
const manageOrders = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("products.product", "name price photo").populate("buyer", "firstname lastname");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      success: false,
      msg: "Error in changing the order status.",
    });
  }
}

module.exports={generateTokenCont,processPayment,getOrders,getAllOrders,manageOrders}
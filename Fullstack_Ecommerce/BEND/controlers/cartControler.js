const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const mongoose = require("mongoose");

// Add to cart
const addCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Validate userId and productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if cart exists for the user
    let cart = await cartModel.findOne({ user: userId });

    if (cart) {
      // Check if product already exists in the cart
      const existingProduct = cart.product.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        return res.status(200).json({
          success: true,
          message: "Product already exists in the cart.",
        });
      }

      // Add product to the existing cart with full product details
      cart.product.push({
        product: productId,
        quantity: 1,
        name: product.name,
        photo: product.photo,
        price: product.price,
        description: product.description,
      });

      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Product added to cart.",
      });
    } else {
      // Create a new cart if no cart exists
      const newCart = new cartModel({
        user: userId,
        product: [
          {
            product: productId,
            quantity: 1,
            name: product.name,
            photo: product.photo,
            price: product.price,
            description: product.description,
          },
        ],
      });

      await newCart.save();
      return res.status(201).json({
        success: true,
        message: "Cart created and product added.",
      });
    }
  } catch (err) {
    console.error("Error in adding to cart:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart.",
    });
  }
};

// Get cart: GET /cart/:userId
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const data = await cartModel
      .findOne({ user: userId })
      .populate("product.product", "name price slug photo description quantity shipping");

    if (data) {
      if (data.product.length === 0) {
        return res.status(200).json({ message: "Cart is empty." });
      }
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Cart not found." });
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Delete a product from cart
const deleteCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Validate productId and userId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.product = cart.product.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart.",
    });
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product.",
    });
  }
};

// Increase quantity
// Increase quantity controller
const incqty = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.product.find(p => p.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity += 1;
    await cart.save();

    res.status(200).json({ message: "Quantity increased", cart });
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ message: "Server error while increasing quantity" });
  }
};


// Decrease quantity
const decqty = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    // Validate productId and cartId format
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid cart or product ID." });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const item = cart.product.find((p) => p.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not found in cart." });

    // Decrease quantity or remove item
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.product = cart.product.filter(
        (p) => p.product.toString() !== productId
      );
    }

    if (cart.product.length === 0) {
      // Optional: Remove empty cart
      await cart.remove();
    } else {
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product quantity decreased.",
    });
  } catch (err) {
    console.error("Error decreasing quantity:", err);
    res.status(500).json({ success: false, message: "Failed to decrease quantity." });
  }
};

module.exports = {
  addCart,
  getCart,
  deleteCart,
  incqty,
  decqty,
};

let mongoose=require("mongoose")

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "productModel" },
      quantity: { type: Number, default: 1 },
      name: String,
      price: Number,
      photo: String,
      description: String,
      category: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
        name: String,
      },
    },
  ],
}, { timestamps: true });

  

let cartModel=mongoose.model("cartModel",cartSchema)

module.exports=cartModel
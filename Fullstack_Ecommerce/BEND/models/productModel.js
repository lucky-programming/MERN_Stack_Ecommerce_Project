let mongoose=require("mongoose")
const category = require("./category_Model")
let productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        unique:true,
        required:true

    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    photo:{
        type:String,
        required:true

    },
    shipping:{
        type:Boolean
    },
    quantity:{
        type:Number,
        required:true
    }

},{timestamps:true})

let productModel=mongoose.model("productModel",productSchema)

module.exports=productModel
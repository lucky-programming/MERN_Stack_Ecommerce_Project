let mongoose=require("mongoose")
const productModel = require("./productModel")
let categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        lowercase:true
    }
})

let category=mongoose.model("Category",categorySchema)

module.exports=category
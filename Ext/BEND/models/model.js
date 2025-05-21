const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    mobile:{
        type: String,
        required: true,
        unique: true,  // Added to prevent duplicate numbers
        match: [/^\d{10}$/, 'Invalid mobile number'] // Ensures exactly 10 digits

    },
    password:{
        type:String,
        required:true,
    },

    securityQuestion:String,
    securityAnswer:String,
    
    role:{
        type:String,
        default:"user"
    },
    address:{
        type:String,
        required:true,
    },
    "profileImage":String

});
let user=mongoose.model("User",userSchema)
//Export the model
module.exports=user
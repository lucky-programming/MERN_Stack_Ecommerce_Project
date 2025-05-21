const user=require("../models/model")
let jwt=require("jsonwebtoken")
let bcrypt=require("bcryptjs")
let multer=require("multer")
let {v4}=require("uuid")
let fs=require("fs")
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./images')
    },
    filename:function (req,file,cb) {
        const unquesuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null,file.fieldname+'_'+unquesuffix+"."+file.mimetype.split("/")[1])
      }

})

let upload=multer({storage:storage})

//Profile Images

const profileImage=async(req,res)=>{
    try{
        console.log("file recieved :",req.file)
        if(!req.file){
            res.json("no file uploaded")
        }

        let findUser=await user.findOne({"email":req.body.email})
    if (findUser){
        findUser.profileImage=req.file.filename//updates the profileImage in the model
        await findUser.save()
        res.json({"msg":"Profile image updated successfully","profileImage":findUser.profileImage})
    }

    }
    catch(err){
        console.log(err)
        res.json({"msg":"Error in uploading the image."})
    }
    
}
// registration code 
let createUser=async(req,res)=>{
    try{

        let {firstname,lastname,address,email,password,mobile,securityQuestion,securityAnswer}=req.body

        let findUser=await user.findOne({ email})
        if(findUser){
            res.status(200).json({"msg":"Account Exist with given email."})
        }else{

            let hashcode= await bcrypt.hash(password,10)
            let hashAnswer=await bcrypt.hash(securityAnswer,10)

            let newUser=new user({firstname,lastname,email,mobile,address,securityQuestion,"password":hashcode,"securityAnswer":hashAnswer})
            console.log(req.body)
            await newUser.save()
            return res.status(201).json({"msg":"Account Created Successfully."})
        }

    }
    catch(err){ 
        res.status(500).json({"msg":"Error in Creating New user."})
        console.log(err)
    }
}


//User Login code 
let userLogin = async (req, res) => {
    try {
        let obj = await user.findOne({ "email": req.body.email });
        if (obj) {
            let f = await bcrypt.compare(req.body.password, obj.password);
            if (f) {
                let tokenPayload = { "email": req.body.email, "role": obj.role, "_id": obj._id  };
                console.log("Token Payload before signing:", tokenPayload); // Debugging output

                let token = jwt.sign(tokenPayload, "laxman", { expiresIn: "5d" });

                res.json({
                    "_id": obj._id,
                    "token": token,
                    "firstname": obj.firstname,
                    "lastname": obj.lastname,
                    "email": obj.email,
                    "mobile": obj.mobile,
                    "role": obj.role,
                    "address": obj.address
                });
            } else {
                res.json({ "msg": "Please Check the Password" });
            }
        } else {
            res.json({ "msg": "Please Check the Email address" });
        }
    } catch (err) {
        res.json({ "msg": "Internal Error While Logging In." });
        console.log(err);
    }
};



//get user
let getUser=async(req,res)=>{
    try{
        let data=await user.find()
            if(!data||data.length===0){
            res.json({"msg":"Data not found"})
        }else{
            res.json(data)
        }

    }
    catch(err){
        res.json({"msg":"error in fetching the user details"})

    }
}


//get single user 
let getSingleUser=async(req,res)=>{
    

    try{
        let singleUser=await user.findOne({"email":req.params.email})
        if(!singleUser){
            res.json({"msg":"User not found."})

        }
        else{
            
            res.json(singleUser)
        }

    }
    catch(err){
        res.status(500).json({"msg":"error in fetching the user details."})
    }
}

//Delete code 
let deleteUser=async(req,res)=>{
    try{
        let f= await user.findOneAndDelete({"email":req.params.email})
        if(!f){
            res.json({"msg":"user not found."})
        }
        else{
            res.status(200).json({"msg":"Account Deleted successfully."})
        }

    }
    catch(err){
        res.status(500).json({"msg":"error in deleting user Account.",err})

    }
}


//userUpdatecode
const updateUser=async(req,res)=>{
    try{
        let f=await user.findOneAndUpdate({"email":req.params.email},req.body)
        if (!f){
            res.status(404).json({"msg":"user not found"})
        }
        else{
            res.json({"msg":"user_Account updated successfully",f})
        }

    }
    catch(err){
        res.json({"msg":"error in updating the user_Details",err})

    }
}

//require sign in
let requireSignIn = async (req, res, next) => {
    try {
        console.log("🔹 Incoming Headers:", req.headers);

        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ "msg": "Unauthorized: Token missing." });
        }

        // Check if "Bearer " is missing and handle it
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // Extract actual token
        }

        console.log("🔹 Extracted Token:", token);

        let decoded = jwt.verify(token, "laxman");
        console.log("🔹 Decoded Token:", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err);
        return res.status(401).json({ "msg": "Unauthorized: Invalid or expired token." });
    }
};





// forgot password reset
let forgotPassword = async (req, res) => {
    try {
        let { email, password } = req.body;

        let userObj = await user.findOne({ "email": req.body.email });
        if (!userObj) {
            return res.status(404).json({ "msg": "Account is not found with the given email. Please create your account." });
        }

        // Hash the new password

        if (!password) {
            return res.status(400).json({ msg: "Password is required" });
        }
        let hashPassword= await bcrypt.hash(password, 10);
        userObj.password=hashPassword

        // Update only the password field for the user with the given email
        await user.findOneAndUpdate({ "email": req.body.email },{ $set: { "password": hashPassword } }) // Filter by email// Correct way to update password

        return res.status(200).json({ "msg": "Password reset successfully. Please log in with your new password." });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ "msg": "Something went wrong in resetting the password." });
    }
};


//checking is admin
let isAdmin = async (req, res, next) => {
    try {
        console.log("🔹 Checking Admin Role - req.user:", req.user); // ✅ LOG req.user

        if (!req.user) {
            return res.status(401).json({ "msg": "Unauthorized: User not logged in." });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({ "msg": "Access denied. Admins only." });
        }

        console.log("✅ Admin access granted!");
        next();
    } catch (err) {
        console.error("Error in isAdmin middleware:", err);
        res.status(500).json({ "msg": "Internal server error." });
    }
};




//verify security quetion before resetting the answer

const verifySecurityQuestion = async (req, res) => {
    try {
        let { email, securityAnswer } = req.body;

        if (!email || !securityAnswer) {
            res.status(400).json({ "msg": "Email and security answer are required." });
        }
        else{
            // Find user by email (case insensitive)
              let findUser = await user.findOne({ email: email.toLowerCase() });

              if (findUser) {
                let isMatch = await bcrypt.compare(securityAnswer, findUser.securityAnswer);
                if (!isMatch) {
                    res.status(400).json({ "msg": "Incorrect security answer." });
               }
               else{
                   res.status(200).json({ "msg": "Security answer verified. You can reset your password." });
               }   
                }
                else{  
                    res.status(404).json({ "msg": "User not found." });                           
                    
                }
            }

    } catch (err) {
        console.error("Error verifying security answer:", err);
        res.status(500).json({ "msg": "Internal server error while verifying security answer." });
    }
};


module.exports={upload,createUser,userLogin,getUser,getSingleUser,deleteUser,updateUser,requireSignIn,isAdmin,forgotPassword,verifySecurityQuestion,profileImage}
let express=require("express")
const { createUser, userLogin, getUser, getSingleUser, deleteUser, updateUser, requireSignIn,isAdmin, forgotPassword, verifySecurityQuestion, upload, profileImage } = require("../controlers/cont")
const { createCategory, updateCategory, deleteCategory, getAllCat, getSingleCat } = require("../controlers/categoryControlers")
const { addProduct, getProduct, deleteProduct, updateProduct, getSingleProduct, getPhoto } = require("../controlers/productControlers")

let rout= express.Router()

rout.post("/addUser",createUser)
rout.post("/login",userLogin)
rout.get("/getUser",getUser)
rout.get("/getSingleUser/:email",getSingleUser)
rout.delete("/deleteUser/:email",requireSignIn,isAdmin,deleteUser)
rout.put("/updateUser/:email",requireSignIn,updateUser)
rout.post("/forgotPassword",forgotPassword)

rout.post("/verify-security-question",verifySecurityQuestion)

//image upload

rout.post("/uploadProfileImage",upload.single("profileImage"),profileImage)

// ROUTES FOR CATEGORY

rout.post("/setCategory",requireSignIn,isAdmin,createCategory)

rout.get("/getAllCat",getAllCat)
rout.get("/getSingleCat/:slug",getSingleCat)

rout.put("/updateCategory/:id",requireSignIn,isAdmin,updateCategory)
rout.delete("/deleteCategory/:id",requireSignIn,isAdmin,deleteCategory)

//PRODUCT ROUTES
// ✅ PRODUCT ROUTES (Only Admins Can Add Products)
rout.post("/addProduct", requireSignIn, isAdmin, upload.single("photo"), addProduct);
rout.get("/getProduct",getProduct)
rout.delete("/deleteProduct/:id",requireSignIn,isAdmin,deleteProduct)
rout.put("/updateProduct/:id",requireSignIn,isAdmin,upload.single("photo"),updateProduct)
rout.get("/singleProduct/:slug",getSingleProduct)
rout.get("/getPhoto/:pid",getPhoto)
module.exports=rout

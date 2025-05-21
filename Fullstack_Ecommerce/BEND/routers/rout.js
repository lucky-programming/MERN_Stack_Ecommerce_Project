let express=require("express")
const { createUser, userLogin, getUser, getSingleUser, deleteUser, updateUser, requireSignIn,isAdmin, forgotPassword, verifySecurityQuestion, upload, profileImage } = require("../controlers/cont")
const { createCategory, updateCategory, deleteCategory, getAllCat, getSingleCat, categoryProducts } = require("../controlers/categoryControlers")
const { addProduct, getProduct, deleteProduct, updateProduct, getSingleProduct, getPhoto, productFilter, productCount, productList, mainSearchProduct, similarProduct } = require("../controlers/productControlers")
const { addCart, deleteCart, incqty, decqty, getCart } = require("../controlers/cartControler")
const { generateTokenCont, processPayment, getOrders, getAllOrders, manageOrders } = require("../controlers/paymentcont")




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

//Filter Product 
rout.post("/filter-product",productFilter)

rout.get("/similar-products/:pid/:cid",similarProduct)

rout.get("/product-category/:slug",categoryProducts)

//PRODUCT ROUTES
// ✅ PRODUCT ROUTES (Only Admins Can Add Products)
rout.post("/addProduct", requireSignIn, isAdmin, upload.single("photo"), addProduct);
rout.get("/getProduct",getProduct)
rout.delete("/deleteProduct/:id",requireSignIn,isAdmin,deleteProduct)
rout.put("/updateProduct/:id",requireSignIn,isAdmin,upload.single("photo"),updateProduct)
rout.get("/singleProduct/:slug",getSingleProduct)
rout.get("/getPhoto/:pid",getPhoto)

rout.get("/product-count",productCount)
rout.get("/product-list/:page", productList);

rout.get("/main-search", mainSearchProduct);

//CART ROUTES
rout.post("/addToCart", addCart);
rout.get("/cart/:userId", getCart);
rout.delete("/cart/:userId/:productId", deleteCart);
rout.patch("/inc/:cartId/:productId", incqty);
rout.patch("/dec/:cartId/:productId", decqty);

//payment intigrations 
rout.get("/braintree-token",generateTokenCont)
rout.post("/payment-process",requireSignIn,processPayment)
rout.get("/get-orderList",requireSignIn,getOrders)
rout.get("/get-AllOrders",requireSignIn,isAdmin,getAllOrders)
rout.put("/manage-orders/:orderId", requireSignIn, isAdmin, manageOrders);

module.exports=rout

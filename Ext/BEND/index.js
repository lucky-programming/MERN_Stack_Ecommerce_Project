let express=require("express")
let mongoose=require("mongoose")
let cors=require("cors")
const rout = require("./routers/rout")

let app=express()
app.use(express.json())//middleware configuration
// ✅ CORS Configuration: Allow Frontend Requests
app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend to access backend
    credentials: true // Allow cookies & authentication headers if needed
}));

// ✅ Serve Static Files (Images)
app.use("/images", express.static("images"));  
app.use("/",rout)

mongoose.connect("mongodb://localhost:27017/ECOM2").then(()=>{
    console.log("mongodb connected to store the ecom data..")
}).catch((err)=>{
    console.log("error in connection..")

})

let port=5000
app.listen(port,()=>{
    console.log("E-commerce server started at port number",port)
})

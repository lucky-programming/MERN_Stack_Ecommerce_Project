const multer = require("multer");
const path = require("path");
const fs = require("fs");
const slugify=require("slugify")
let productModel = require("../models/productModel");
const { off } = require("process");
const category = require("../models/category_Model");

// ✅ Define upload directory
const uploadDir = path.join(__dirname, "../images");

// ✅ Ensure the folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files in 'uploads' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// ✅ Upload Middleware
const upload = multer({ storage });

let addProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Image file is required." });
    }

    // ✅ Validate required fields
    const { name, price, quantity, description, category } = req.body;
    if (!name || !price || !quantity || !description || !category) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // ✅ Generate a unique slug
    let slug = slugify(name, { lower: true, strict: true });
    
    // ✅ Check if the slug already exists, and modify it if needed
    let existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`; // Append timestamp to make it unique
    }

    // ✅ Save product with correct image path
    let newProduct = new productModel({
      ...req.body,
      slug, // ✅ Ensure unique slug
      photo: `/images/${req.file.filename}`, // ✅ Store correct image path
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product successfully added", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

let getProduct=async(req,res)=>{
  try{
     
    let products = await productModel
      .find({})
      .populate("category")  //shows all products within the specific category           
      .select("name price photo category description shipping quantity slug")           
      .limit(12)                  // 3️⃣ Limit the result to 12 products
      .sort({ createdAt: -1 });   // 4️⃣ Sort by newest products first
    res.json({"msg":"All products",products})

  }
  catch(err){
    res.status(500).status({
      success:false,
      msg:"Error in getting Product",
      err:err.message
    }   
    )
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params; // ✅ Get slug from URL parameters

    if (!slug) {
      return res.status(400).json({ msg: "Product slug is required." });
    }

    const product = await productModel
      .findOne({ slug })
      .populate("category") // ✅ Populate category details
      .select("name price photo description quantity shipping category slug");

    if (!product) {
      return res.status(404).json({ msg: "Product not found." });
    }

    res.status(200).json({ msg: "Your required Product", product });
  } catch (err) {
    console.error("Error in fetching the product:", err);
    res.status(500).json({
      success: false,
      msg: "Error in fetching the product.",
      error: err.message, // ✅ Proper error message
    });
  }
};

const getPhoto = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.pid).select("photo");

    if (!product || !product.photo) {
      return res.status(404).json({ msg: "Product image not found in DB" });
    }

    // ✅ Ensure correct file path (remove leading slash if exists)
    let imagePath = path.join(__dirname, "../images", path.basename(product.photo));

    // ✅ Debugging - Check the constructed path
    console.log("Checking Image Path:", imagePath);

    // ✅ Check if the file exists
    if (!fs.existsSync(imagePath)) {
      console.log("File not found:", imagePath);
      return res.status(404).json({ msg: "Image file not found on server" });
    }

    // ✅ Send the image file
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error fetching product image:", error);
    res.status(500).json({
      success: false,
      msg: "Error in fetching the product image",
      error: error.message,
    });
  }
};



let deleteProduct=async(req,res)=>{
  try{

    let {id}=req.params
    if(!id){
       res.json({"msg":"Product Id is required"})
    }
    else{

      let product=await productModel.findByIdAndDelete(id)
      if(product){
        res.json({
          success:true,      
          msg:"Product Successfully deleted.",product})
        }
        else{
          res.json({"msg":"Product not found."})
        }
      }
      }

  catch(err){
    console.log("Error in fetching the product:",err)
    res.status(500).json({
      success:false,
      msg:"Error in Fetching the Product",
      err:err.message
    })

  }
}

let updateProduct = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "The product ID is required." });
    }

    // Find the existing product
    let existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found." });
    }

    // Extract fields from req.body
    let { name, price, quantity, description, category } = req.body;
    let updateData = { name, price, quantity, description, category };

    //  image update if a new file is uploaded
    if (req.file) {
      updateData.photo = `/images/${req.file.filename}`;
    }

    // Generate new slug if name is updated
    if (name && name !== existingProduct.name) {
      let newSlug = slugify(name, { lower: true, strict: true });
      
      // Check if the slug exists and modify it
      let slugExists = await productModel.findOne({ slug: newSlug });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      updateData.slug = newSlug;
    }

    let updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ msg: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ msg: "Error updating the product", error: err.message });
  }
};

let productFilter = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    let args = {};

    // ✅ Category Filter
    if (checked.length > 0) {
      args.category = { $in: checked };
    }

    // ✅ Price Range Filter
    if (radio.length === 2) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1] === Infinity ? Number.MAX_SAFE_INTEGER : radio[1],
      };
    }

    // ✅ Fetch filtered products
    const products = await productModel
      .find(args)
      .populate("category")
      .select("name price photo category description shipping quantity slug");

    res.status(200).json({
      success: true,
      products,
    });

  } catch (err) {
    console.error("Error in product filter:", err);
    res.status(500).json({
      success: false,
      msg: "Error in filtering products",
      error: err.message,
    });
  }
};

// Count total products
const productCount = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (err) {
    console.log("Error in counting products:", err);
    res.status(500).send({
      success: false,
      message: "Error in counting the products.",
    });
  }
};

// Paginated product list
const productList = async (req, res) => {
  try {
    const perPage = 12;
    const page = parseInt(req.params.page) || 1;

    const products = await productModel
      .find({})
      .select("name price photo category description shipping quantity slug")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "List of products",
      products,
    });
  } catch (error) {
    console.log("Error fetching product list:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching product list",
      error,
    });
  }
};

const mainSearchProduct = async (req, res) => {
  try {
    const { keyword = "", category: selectedCategory, price } = req.query;
    console.log("Incoming search query:", { keyword, category: selectedCategory, price });

    const searchConditions = [];

    // Match ANY word from keyword (split by space)
    if (keyword.trim()) {
      const words = keyword.trim().split(/\s+/);

      const wordConditions = words.map(word => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { brand: { $regex: word, $options: "i" } },
        ]
      }));

      // Also search matching category names
      const matchingCategories = await category.find({
        name: { $regex: keyword, $options: "i" }
      });

      const categoryIds = matchingCategories.map(cat => cat._id);

      if (categoryIds.length > 0) {
        wordConditions.push({ category: { $in: categoryIds } });
      }

      searchConditions.push({ $or: wordConditions });
    }

    const filter = searchConditions.length ? { $and: searchConditions } : {};

    // If a category filter is selected (from UI)
    if (selectedCategory) {
      filter.category = selectedCategory;
    }

    // Price filter
    if (price) {
      const [min, max] = price.split(",").map(Number);
      filter.price = { $gte: min || 0, $lte: max || 999999 };
    }

    const products = await productModel.find(filter)
      .limit(20)
      .select("-photo")
      .populate("category");

    res.status(200).json(products);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Error in product search", error: error.message });
  }
};

const similarProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    // Fetch products from the same category, excluding the current product
    const similar = await productModel.find({
      category: cid,
      _id: { $ne: pid }
    })
      .select("-photo") // exclude photo for performance, if needed
      .limit(6) // limit similar products
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Similar products fetched successfully",
      products: similar,
    });
  } catch (error) {
    console.error("Error in similarProduct:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar products",
      error: error.message,
    });
  }
};



module.exports = {similarProduct,mainSearchProduct, productList,productCount,productFilter,upload, addProduct,getProduct,deleteProduct,updateProduct,getSingleProduct ,getPhoto};

const category=require("../models/category_Model")

let slugify=require("slugify")

let createCategory=async(req,res)=>{
    try{
        let {name}=req.body
       
        if(!name){
           return res.json({"msg":"The name is required"})
        }
        
            let findCat= await category.findOne({name})
            if(findCat){
                res.json({"msg":"The Category already exist."})
            }else{
                let newCatogory=await new category({name,slug:slugify(name)})
                await newCatogory.save()
                res.json({"msg":"Category created successfully"})

            } 
        
    }
    catch(err){
        res.json({"msg":"Error in creating the category."})
    }
}

//GET CATEGORY ROUTES
let getAllCat=async(req,res)=>{
    try{
        let findCat=await category.find({})
        if(!findCat){
            res.json({"msg":"Category is not available."})
        }
        else{
            res.json({"msg":"All Category List.",findCat})
        }

    }
    catch(err){
        res.status(500).json({"msg":"Error in finding Category."})

    }
}

//GET SINGLE CATEGORY 

let getSingleCat=async(req,res)=>{
    try{
        let getCat=await category.findOne({"slug":req.params.slug})
        if (getCat){
            res.json({"msg":"Required Category",getCat})
        }

    }
    catch(err){
        res.status(500).json({"msg":"Error in fetching the Singke Category"})
    }
}

let updateCategory=async(req,res)=>{
    try{
        let {id}=req.params
        let {name}=req.body
        let slug = name.toLowerCase().replace(/\s+/g, "-"); 
        let findCat=await category.findOneAndUpdate({_id:id},{name,slug},{new:true})
        if(findCat){
            res.json({"msg":"The category is successfully Updated."})
        }

    }
    catch(err){
        console.log("error in updating the category:",err)
    }
}


let deleteCategory=async(req,res)=>{
    try{

        let findCat=await category.findByIdAndDelete({"_id":req.params.id})
        if(findCat){
            res.json({"msg":"The category is successfully deleted."})
        }

    }
    catch(err){
        console.log("error in deleting the category:",err)
    }
}

module.exports={createCategory,getAllCat,updateCategory,deleteCategory,getSingleCat}

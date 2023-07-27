const Category = require('../models/Category');
const {verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

router.post("/",verifyTokenAdmin, upload.array("image"), async (req,res)=>{
    try{
        const search = await Category.findOne({categoryname:req.body.categoryname});
        const uploadPromises = req.files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        });
        const uploadResults = await Promise.all(uploadPromises);
        const image = uploadResults.map(result => {
            return {public_id:result.public_id, url:result.url}
        });
        if(!search){
            const newCategory = new Category({
                categoryname:req.body.categoryname,
                image:image
            })
            try{
                const uploadCategory = await newCategory.save();
                res.status(200).json(uploadCategory);
            }
            catch(err){
                res.status(500).json(err);
                console.log(err);
            }
        }
        else{
            res.status(300).json({message:"File Already Exists"});
        }
    }
    catch(err){
        console.log(err);
    }
});

//get all category;
router.get('/', async (req,res)=>{
    try{
        const category = await Category.find();
        const total = category.length;
        const categories = await User.aggregate([
            {
                $group: {
                _id: '$category',
                count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({total:total,category:category,categories:categories});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

//delete category
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await Category.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({message:"Category has been deleted"});
    }
    catch(err){
        res.status(500).json({'message':err});
        console.log(err);
    }
})

//get category
router.get("/:id",verifyTokenAuthorization, async (req,res)=>{
    try{
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});


module.exports = router
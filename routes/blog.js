const Blog = require('../models/Blog');
const {verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

router.post("/", verifyTokenAdmin, upload.array("image"), async (req,res)=>{
    const uploadPromises = req.files.map(async file => {
        const result = await cloudinary.uploader.upload(file.path);
        return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const image = uploadResults.map(result => {
        return {public_id:result.public_id, url:result.url}
    });
    const newBlog = new Blog({
        blogname:req.body.blogname,
        blogdescription:req.body.blogdescription,
        blogimage:image,
        blogcategory:req.body.blogcategory
    })
    try{
        const uploadBlog = await newBlog.save();
        res.status(200).json(uploadBlog);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    } 
});

//change blog data;
router.put("/:id",verifyTokenAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedBlog);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//delete blog;
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await Blog.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({message:"Blog has been deleted"});
    }
    catch(err){
        res.status(500).json({'message':err});
        console.log(err);
    }
})

//get blog
router.get("/:id", async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        res.status(200).json(blog);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all blog;
router.get('/', async (req,res)=>{
    try{
        const blogs = await Blog.find();
        const total = blogs.length;
        res.status(200).json({blogs:blogs, total:total});
        
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});


module.exports = router
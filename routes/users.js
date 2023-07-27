const User = require('../models/User');
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

//change user data;
router.post("/:id",verifyTokenAuthorization,upload.array("image"),async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try{
        const uploadPromises = req.files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        });
        const uploadResults = await Promise.all(uploadPromises);
        const image = uploadResults.map(result => {
            return {public_id:result.public_id, url:result.url}
        });
        const newUpdatedUser = {...req.body, image:image};
        const updatedUser = await User.findByIdAndUpdate({_id:req.params.id},{
            $set:newUpdatedUser
        },{new:true})
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//delete user;
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await User.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({message:"User has been deleted"});
    }
    catch(err){
        res.status(500).json({'message':err});
        console.log(err);
    }
})

//get user
router.get("/:id",verifyTokenAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all users;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const users = await User.find({isArtisan:false,isAdmin:false});
        const total = users.length;
        res.status(200).json({users:users, total:total});
        
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

//get all artisans;
router.get('/artisans', verifyTokenAdmin, async (req,res)=>{
    try{
        const users = await User.find({isArtisan:true,isAdmin:false});
        const total = users.length;
        res.status(200).json({users:users, total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

router.get('/users/artisans', async (req,res)=>{
    try{
        const users = await User.find({isArtisan:true,isAdmin:false});
        res.status(200).json({users:users});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

router.get('/artisans/:id', async (req,res)=>{
    try{
        const users = await User.find({isArtisan:true,isAdmin:false});
        const total = users.length;
        res.status(200).json({users:users, total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

module.exports = router
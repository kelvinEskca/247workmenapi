const Kyc = require('../models/Kyc');
const {verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");

router.post("/", upload.array("image"),async (req,res)=>{
    try{
        const search = await Kyc.findOne({email:req.body.email});
        const uploadPromises = req.files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path);
            return result;
        });
        const uploadResults = await Promise.all(uploadPromises);
        const image = uploadResults.map(result => {
            return {public_id:result.public_id, url:result.url}
        });
        if(!search){
            const newKyc = new Kyc({
                email:req.body.email,
                idname:req.body.idname,
                idnumber:req.body.idnumber,
                userId:req.body.userId,
                image:image
            })
            try{
                const uploadKyc = await newKyc.save();
                res.status(200).json({data:uploadKyc, message:"Upload Success",statusCode:200});
            }
            catch(err){
                res.status(500).json(err);
                console.log(err);
            }
        }
        else{
            res.status(300).json({message:"File Already Exists",statusCode:300});
        }
    }
    catch(err){
        console.log(err);
    }
    
    
});

//get all kyc;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const kyc = await Kyc.find();
        const total = kyc.length;
        res.status(200).json({kyc:kyc, total:total});
        
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

//delete KYC
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await Kyc.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({message:"KYC has been deleted"});
    }
    catch(err){
        res.status(500).json({'message':err});
        console.log(err);
    }
})

//get kyc
router.get("/:id",verifyTokenAuthorization, async (req,res)=>{
    try{
        const kyc = await Kyc.find({email:req.params.id});
        const total = kyc.length;
        res.status(200).json({kyc:kyc,total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

module.exports = router
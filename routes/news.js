const Newsletter = require('../models/Newsletter');
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();

router.post("/", async (req,res)=>{
    const newNewsletter = new Newsletter({
        email : req.body.email
    });

    try{
        const savedNewsletter = await newNewsletter.save();
        res.status(201).json(savedNewsletter);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }

});

//change news data;
router.put("/:id",verifyTokenAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try{
        const updatedNewsletter = await Newsletter.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedNewsletter);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//delete news;
router.delete("/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await Newsletter.findByIdAndDelete(req.params.id);
        res.status(200).json("Newsletter had been deleted");
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//get news
router.get("/:id",verifyTokenAdmin, async (req,res)=>{
    try{
        const Newsletter = await Newsletter.findById(req.params.id);
        const {password, ...others} = Newsletter._doc;
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all news;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const Newsletters = await Newsletter.find();
        const total = Newsletter.length;
        res.status(200).json({Newsletters:Newsletters,total:total});
    }
    catch(err){
        res.status(500).json(err)
        console.log(err)
    }
});


module.exports = router
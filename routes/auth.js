const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//Register route;
router.post("/register", async (req,res)=>{
    const isArtisan = req.body.isArtisan;
    if(!isArtisan){
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });
    
        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
            console.log(savedUser);
        }
        catch(err){
            res.status(500).json(err);
            console.log(err);
        }
    }
    else{
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
            isArtisan : true,
        });
    
        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
            console.log(savedUser);
        }
        catch(err){
            res.status(500).json(err);
            console.log(err);
        }
    }
    

});

//Login route;
router.post('/login', async (req,res)=>{
    console.log("trying");
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(401).json("Wrong credentials");
        }
        else if(user){
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if(originalPassword !== req.body.password){
                res.status(401).json("Wrong credentials");
            }
            else{
                const accessToken = jwt.sign({
                    id:user._id,isAdmin:user.isAdmin,isArtisan:user.isArtisan
                },process.env.JWT_SEC,{expiresIn:"3d"})
                const {password,cpassword, ...others} = user._doc;
                res.status(200).json({...others,accessToken});
            }
        }
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
    
});

//get logged in user;
router.post('/userData', async (req,res)=>{
    const accessToken = req.body.token;
    try{
        const user = jwt.verify(accessToken,process.env.JWT_SEC);
        const id = user.id;
        await User.findOne({_id:id}).then((data)=>{
            const {password,cpassword, ...others} = data._doc;
            res.status(200).json({...others,loggedIn:true,message:"User data retrieved"});
        });
    }
    catch(err){
        res.status(500).json({err,loggedIn:false,message:"Failed To retrieve data"});
        console.log(err);
    }
})



module.exports = router
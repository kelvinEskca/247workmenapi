const Contact = require('../models/Contact');
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();

router.post("/", async (req,res)=>{
    const newContact = new Contact({
        fname : req.body.fname,
        lname: req.body.lname,
        email : req.body.email,
        message : req.body.message
        
    });

    try{
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
        console.log(savedContact);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }

});

//change Contact data;
router.put("/:id",verifyTokenAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try{
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedContact);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//delete Contact;
router.delete("/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json("Contact had been deleted");
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

//get Contact
router.get("/:id",verifyTokenAdmin, async (req,res)=>{
    try{
        const Contact = await Contact.findById(req.params.id);
        const {password, ...others} = Contact._doc;
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all Contact;
router.get('/', verifyTokenAdmin, async (req,res)=>{
    try{
        const Contacts = await Contact.find();
        const total = Contacts.length;
        res.status(200).json({Contacts:Contacts,total:total});
    }
    catch(err){
        res.status(500).json(err)
        console.log(err)
    }
});


module.exports = router
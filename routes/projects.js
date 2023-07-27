const UserProjects = require('../models/UserProjects');
const {verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');
const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const storage = multer.memoryStorage();
const upload = multer({ dest: "../uploads" });
const { uploader } = require("../utils/cloudinary");


router.post("/", upload.array("image"), async (req,res)=>{
    const uploadPromises = req.files.map(async file => {
        const result = await cloudinary.uploader.upload(file.path);
        return result;
    });
    const uploadResults = await Promise.all(uploadPromises);
    const image = uploadResults.map(result => {
        return {public_id:result.public_id, url:result.url}
    });
    const newProject = new UserProjects({
        email:req.body.email,
        projectname:req.body.projectname,
        category:req.body.category,
        projectdescription:req.body.projectdescription,
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        location:req.body.location,
        userId:req.body.userId,
        image:image
    })
    try{
        const uploadProject = await newProject.save();
        res.status(200).json({uploadProject:uploadProject});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//get all projects;
router.get('/', async (req,res)=>{
    try{
        const projects = await UserProjects.find();
        const total = projects.length;
        const categories = await UserProjects.aggregate([
            {
                $group: {
                _id: '$category',
                count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({projects:projects, total:total});
        
    }
    catch(err){
        res.status(500).json(err);
        console.log(err)
    }
});

//delete projects
router.post("/delete/:id", verifyTokenAdmin, async (req,res)=>{
    try{
        const deleted = await UserProjects.findByIdAndDelete({_id:req.params.id});
        res.status(200).json({message:"Project has been deleted"});
    }
    catch(err){
        res.status(500).json({'message':err});
        console.log(err);
    }
})

//get project
router.get("/:id",verifyTokenAuthorization, async (req,res)=>{
    try{
        const project = await UserProjects.findById(req.params.id);
        res.status(200).json(project);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.get("/ads/:id", verifyTokenAuthorization, async (req,res)=>{
    try{
        const project = await UserProjects.find({userId:req.params.id});
        const total = project.length
        res.status(200).json({project:project,total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.get("/ads/ad/:id", async (req,res)=>{
    try{
        const project = await UserProjects.find({userId:req.params.id});
        res.status(200).json(project);
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.get("/ads/ads/:id", async (req,res)=>{
    console.log(req.params.id);
    try{
        const project = await UserProjects.find({userId:req.params.id});
        const total = project.length;
        res.status(200).json({total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.get("/userproject/:id", async (req,res)=>{
    try{
        const project = await UserProjects.find({category:req.params.id});
        const total = project.length;
        res.status(200).json({project:project,total:total});
    }
    catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

module.exports = router
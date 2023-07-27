const mongoose = require('mongoose');

const userProjectsSchema = new mongoose.Schema({
    email:{type:String,required:true},
    phone:{type:String,required:true},
    category:{type:String,required:true},
    projectname:{type:String,required:true},
    projectdescription:{type:String,required:true},
    startdate:{type:String,required:true},
    enddate:{type:String,required:true},
    location:{type:String,required:true},
    userId:{type:String,required:true},
    verified:{type:String,required:true,default:false},
    image:{type:Array,required:true}

},{timestamps:true})

module.exports = mongoose.model("userProjects",userProjectsSchema);

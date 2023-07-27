const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogname:{type:String,required:true,unique:true},
    blogcategory:{type:String,required:true},
    blogdescription:{type:String,required:true},
    blogimage:{type:Array,required:true}
},{timestamps:true})

module.exports = mongoose.model("blog",blogSchema);
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryname:{type:String,required:true,unique:true},
    image:{type:Array,required:true},
},{timestamps:true})

module.exports = mongoose.model("category",categorySchema);
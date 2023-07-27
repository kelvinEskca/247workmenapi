const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
},{timestamps:true})

module.exports = mongoose.model("news",newsSchema);

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    firstname:{type:String},
    lastname:{type:String},
    message:{type:String,unique:true},
},{timestamps:true})

module.exports = mongoose.model("contact",contactSchema);

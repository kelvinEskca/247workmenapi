const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    idname:{type:String,required:true},
    idnumber:{type:String,required:true},
    status:{type:String,required:true,default:false},
    image:{type:Array,required:true},
    userId:{type:String,required:true},
},{timestamps:true})

module.exports = mongoose.model("kyc",kycSchema);

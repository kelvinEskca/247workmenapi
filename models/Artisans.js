const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    bio:{type:String,required:true},
    registrationNumber:{type:String,required:true},
    businessName:{type:String,required:true},
    reviews:{type:Array},
    featuredPhotos:{type:Array,required:true},
    userId:{type:String,required:true}
},{timestamps:true})

module.exports = mongoose.model("artisan",artisanSchema);
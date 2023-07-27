const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,unique:true},
    firstname:{type:String},
    lastname:{type:String},
    company:{type:String},
    address:{type:String},
    city:{type:String},
    category:{type:String},
    country:{type:String},
    postalcode:{type:String},
    aboutme:{type:String},
    password:{type:String},
    isAdmin:{type:Boolean,default:false},
    isArtisan:{type:Boolean,default:false},
    followers:{type:Number,default:0},
    following:{type:Number,default:0},
    image:{type:Array,required:true}
},{timestamps:true})

module.exports = mongoose.model("user",userSchema);

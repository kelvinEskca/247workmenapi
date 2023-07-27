const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contact');
const newsRoute = require('./routes/news');
const projectRoute = require('./routes/projects');
const kycRoute = require('./routes/kyc');
const artisanRoute = require('./routes/artisans');
const categoryRoute = require('./routes/category');
const blogRoute = require('./routes/blog');

dotenv.config();
const app = express();
const session = require('express-session');
app.use(session({key:"userid",secret:"subscribe",resave:false,saveUninitialized: true,save:false,cookie:{
    expires: 60 * 60 * 24,
}}));

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true }).then(()=>{
    console.log("You are awesome")
}).catch((err)=>{
    console.log(err);
})

//middleware;
app.use(cors({
    origin: true, 
    methods:["GET","POST","PUT","DELETE"],
    credentials: true, 
}));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/artisans", artisanRoute);
app.use("/api/category", categoryRoute);
app.use("/api/blog", blogRoute);
app.use("/api/news", newsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/projects", projectRoute);
app.use("/api/kyc", kycRoute);


app.listen(5001,()=>{
    console.log("Life,Design,Code");
})
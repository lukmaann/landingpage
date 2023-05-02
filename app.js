const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require("passport-local-mongoose");
require("dotenv").config();

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false,
}))

app.use(passport.initialize());
app.use(passport.session());
// -----------------------------database-----------------------------------

const uri=process.env.URI;
mongoose.connect(uri).then(()=>{
    console.log("connected to mongodb");
})
const userschema=new mongoose.Schema({
    username:String,
    password:String
    
})


const secret=process.env.SECRET;
userschema.plugin(passportLocalMongoose);
const User=mongoose.model("user",userschema);


passport.use(User.createStrategy());
// passport.use(new )

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








// ---------------------passport-----------------------------------------









app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})





app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets");

  }else{
    res.redirect("/login")
  }
})

app.post("/login",(req,res)=>{
  const user= new User({
    username:req.body.email,
    password:req.body.password
  })
  
  req.login(user,(err)=>{
    if(err){
      console.log(err);
      res.redirect("/");
    }else{
      res.redirect("/secrets")
    }
  })


})

app.post("/register",(req,res)=>{
    const email=req.body.username;
    const pass=req.body.password;
    console.log(email);
    console.log(pass);

   User.register({username:email},pass,(err,user)=>{
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate('local')(req,res,()=>{
        res.redirect('/secrets')
      })
    }
   })
  

    
   
   

})







// ----------------------------------------listening at------------------------
const port=process.env.PORT || 300;

app.listen(port,()=>{
    console.log("server started at "+port);
})
const express=require("express");
const bodyParser=require("body-parser");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
// const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

// -----------------------------database-----------------------------------

const uri=process.env.URI;
mongoose.connect(uri).then(()=>{
    console.log("connected to mongodb");
})
const userschema=new mongoose.Schema({
    email:String,
    password:String
    
})

const newuser=mongoose.model("user",userschema);







// ----------------------------------------------------------------------------
app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})



app.post("/login",(req,res)=>{
    const email=req.body.email;
    const pass=req.body.password;
    newuser.findOne({email:email}).then((found)=>{
        if(!found){
            res.send("user not register please register")
        }else{
            if(pass===found.password){
                res.send("welcome")
            }else{
                res.send("getlost you mf")
            }
        }
    })
    
})

app.post("/register",(req,res)=>{
    const email=req.body.email;
    const pass=req.body.password;
    newuser.findOne({email:email}).then((found)=>{
        if(!found){
            const register=new newuser({email:email,password:pass});
            register.save().then(()=>{
                res.send("new user registered");
            })
            
        }else{
            res.send("user already regitered");
        }
    })
   

})
const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("server started at "+port);
})
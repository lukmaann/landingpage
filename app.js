const express=require("express");
const bodyParser=require("body-parser");
const { default: mongoose } = require("mongoose");
const encrypt=require('mongoose-encryption');
require("dotenv").config();
const app=express();
const bcrypt=require("bcrypt");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
const saltrounds=10;
// -----------------------------database-----------------------------------

const uri=process.env.URI;
mongoose.connect(uri).then(()=>{
    console.log("connected to mongodb");
})
const userschema=new mongoose.Schema({
    email:String,
    password:String
    
})

const secret=process.env.SECRET;
userschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});
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

    bcrypt.hash(pass,saltrounds,(err,hash)=>{
        newuser.findOne({email:email}).then((found)=>{
            if(!found){
                res.send("user not register please register")
            }else{
                bcrypt.compare(pass,found.password,(err,result)=>{
                    if(result){
                        res.send("welcome back")
                    }else{
                        res.send("get lost you MF")
                    }
                })
              
            }
        })

    })

  
    
})

app.post("/register",(req,res)=>{
    const email=req.body.email;
    const pass=req.body.password;
    bcrypt.hash(pass,saltrounds,(err,hash)=>{
        newuser.findOne({email:email}).then((found)=>{
            if(!found){
                const register=new newuser({email:email,password:hash});
                register.save().then(()=>{
                    res.send("new user registered");
                })
                
            }else{
                res.send("user already regitered");
            }
        })

    })
   
   

})
const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("server started at "+port);
})
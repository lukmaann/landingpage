const express=require("express");
const bodyParser=require("body-parser");
require("dotenv").config();
// const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));


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
    res.send("welcome")
})
const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("server started at "+port);
})
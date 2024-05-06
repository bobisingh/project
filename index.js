const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError=require('./Utils/ExpressError');
const session=require("express-session");
const flash = require("connect-flash");


const Info=require('./Models/Information');
const Room=require('./Models/Rooms');
const Image=require('./Models/Images');



const MONGO_URL="mongodb+srv://bobisinghcs20:o4ZbxrfthdhUDmXB@cluster0.mvkqpgg.mongodb.net/MemoryHub";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
    .then( ()=>{
        console.log("connected to mongoDB");
    })
    .catch( (err)=>{
        console.log(err);
    });



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


const sessionOptions={
    secret:"mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};



app.get('/',(req,res)=>{
    res.render('Home');
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})



const Rooms=require('./routes/Event');
const Images=require('./routes/Images');




app.get('/Login',(req,res)=>{
    res.render('Login');
});

app.use("/Rooms",Rooms);
app.use("/Rooms/:id",Images);




app.use("*",(req,res,next)=>{
    res.render("404-Error");
    
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
  
    res.status(statusCode).render("Error",{err});
})

const PORT = 5000;
app.listen(PORT,()=>{
    console.log('server run at port ',PORT);
})




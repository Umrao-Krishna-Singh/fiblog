const express = require ("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const passport = require("passport");
// const initializePassport = require("./passport-config");
// const flash = require("express-flash");
// const session = require("express-session");


// initializePassport(passport, email => {
//   users.find(user => user.email === email)
// })


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));
// app.use(flash());
// app.use(session(
//   secret: abcd;
// );)

mongoose.connect(`mongodb+srv://admin-Umrao:hjMHmQVfT7YJHc44@cluster0.6sp92.mongodb.net/userDB`);


const usersDataSchema = new mongoose.Schema({
  userName: String,
  userEmail: {type: String, unique: true},
  userPass: String
})

const UserData = new mongoose.model("userData", usersDataSchema)


app.get("/", (req,res)=>{
    res.render('Login.ejs');
  })
app.post("/", (req,res)=>{
    let emailCheck = req.body.email;
    let passwordCheck = req.body.password;
   UserData.find({userEmail: emailCheck}, async (err, docs)=>{
    if (err){
      res.redirect("/fail");
      console.log("DB error - U" + err);
    } else{
      console.log(docs);
        console.log("inside async");
        let checkingPassword = docs[0].userPass;
        console.log(checkingPassword);
        if ( await bcrypt.compare(  passwordCheck, checkingPassword)){
          console.log("inside if");
          res.redirect("/input");
        } else {
          console.log("inside else");
          res.redirect("/fail");
          console.log("BC error - U" + err);
        }}
    })
   })

app.get("/register",(req,res)=>{
  res.render('Register.ejs');
})
app.post("/register", async (req,res)=>{
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = new UserData({
      userName: req.body.name,
      userEmail: req.body.email,
      userPass: hashedPassword
    }) 
    users.save(function(err){
      if (!err) {
        res.redirect('/');
      } else {
        res.redirect('/fail');
      }
    })
    
  } catch{
    res.redirect('/fail');
  }
})
app.get("/input", (req, res)=>{
  res.render('Input.ejs');
})

let fib = [];
app.post("/input", (req, res)=>{

  let firstNumber = parseInt(req.body.firstNumber, 10);
  let secondNumber = parseInt(req.body.secondNumber, 10);
  let seqLength = parseInt(req.body.seqLength, 10);
  fib.push(firstNumber);
  console.log(fib);
  fib.push(secondNumber);
  console.log(fib);
  if (!seqLength || seqLength < 10){
  seqLength = 10;
  for (let x = 2; x < seqLength; x++){
    let newNumber = (fib[(x-2)] + fib [(x-1)]);
    console.log(newNumber);
    fib.push(newNumber);
  }
  console.log(fib);
} else{
  for (let x = 2; x < seqLength; x++){
    let newNumber = (fib[(x-2)] + fib [(x-1)]);
    console.log(newNumber);
    fib.push(newNumber);
  }
  console.log(fib);

}
  res.redirect("/fib")
})

app.get("/fib", (req, res)=>{
  res.render('fib.ejs', {
    fibseq: fib
  })
  fib=[];
  console.log(fib);
})
app.get("/fail", (req, res)=>{
  res.render('fail.ejs')
})

// app.get("/series.html", (req,res)=>{

// })

// fibonacci sequence generation



app.post("/", (req, res)=>{
   
    res.sendFile(__dirname + "/series.html")
  })

app.listen(3000, ()=>{
    console.log("server started")
})
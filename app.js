const express =require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");

//initialiazed express App
const app = express();


//serve static files to server
app.use(express.static(path.join(__dirname, "public")));

//Set up View Engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

//bodyParser and validator implementation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(validator());

//Initialized Express Session
app.use(session({
  secret:'whats poppin',
  resave: false,
  saveUninitialized: false
}));

let users = [{username : "grantpaschal", password: "password"}];
let messages = [];

// "/" endpoint
app.get("/", function (req, res) {
  if (req.session.username){
      res.render("users", {username: req.session.username, password:req.session.password});
  } else {
  //Render index.mustache file
  res.redirect("/login");
}
});

app.get("/login",function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  let loggedUser;

users.forEach(function(user){
  if (user.username === req.body.username){
    loggedUser = user;
  }else{
    loggedUser = [
      {username:"",
      password: ""
    }]
  }
});

    req.checkBody("username", "Please Enter a valid username.").notEmpty();
    req.checkBody("password", "Please Enter a Password.").notEmpty();
    req.checkBody("password", "Invalid password and username combination ").equals(loggedUser.password);

    let errors = req.validationErrors();

    if (errors){
      errors.forEach(function(error){
        messages.push(error.msg);
      });
      res.render("login", {errors:messages});
    } else{


      req.session.username = req.body.username;
      req.session.password =req.body.password;

      res.redirect("/");
      }
    });





app.listen(3001, function(){
  console.log("App is Running on localhost:3001");
});

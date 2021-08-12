//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const userEmail = req.body.username;
  const userPassword = req.body.password;

  bcrypt.hash(userPassword, saltRounds, function(err, hash) {
    const user = new User({
      email: userEmail,
      password: hash
    });
    user.save(function(err) {
      if (err)
        console.log(err);
      else
        res.render("secrets");
    });
  });


});

app.post("/login", function(req, res) {
  const userEmail = req.body.username;
  const userPassword = req.body.password;

  User.findOne({
    email: userEmail
  }, function(err, foundUser) {
    if (err)
      console.log(err);
    else {
      if (foundUser)
        bcrypt.compare(userPassword,foundUser.password,function(err,result){
          if(result===true)
          res.render("secrets");
        });
    }
  });
});





app.listen(3000, function() {
  console.log("server is listening to port 3000");
});

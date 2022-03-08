const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let userModel = require("../model/user");
let User = userModel.User;
const JWT_SECRET = require("../config/db").Secret;

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

const createNewUser = async (req, res) => {

  //console.log("req.body124", req.body);
  const { email, password: plainTextPassword, username, userType } = req.body;

  if (!email || email == "" || typeof email !== "string") {
    return res.json({ status: "error", message: "Invalid email" });
  }

  if (
    !plainTextPassword ||
    plainTextPassword == "" ||
    typeof plainTextPassword !== "string"
  ) {
    return res.json({ status: "error", message: "Invalid password" });
  }

  if (!username || username == "" || typeof username !== "string") {
    return res.json({ status: "error", message: "Invalid username" });
  }

  if (!userType || userType == "" || typeof userType !== "string") {
    return res.json({ status: "error", message: "Invalid userType" });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  let newUser = new User({
    username: req.body.username,
    password: password,
    email: req.body.email,
    contact: req.body.contact,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userType: req.body.userType,
  });

  try {
    const response = await User.create(newUser);
    //console.log("response123: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", message: "User already exist." });
    }
    throw error;
  }

  res.json({ status: "ok", message: "User registered successfully" });
};

const userLogin = async (req, res) => {
  console.log("req.body222", req.body);
  let { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    console.log("user", user);

    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid username/password",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, email: user.email, username:user.username}, JWT_SECRET);

      res.json({ status: "ok", token: token });
    } else {
      res.json({ status: "error", message: "Invalid username/password" });
    }
  } catch (error) {
    throw error;
  }
};

const findByEmail = async (req, res, next) => {
  let email = req.body.email;

  User.find({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    } else if (typeof user === "undefined" || user === null) {
      res.json({
        code: "304",
        message: "Error : Enter valid email!",
      });
    } else {
      return res.json(user);
      // return res.redirect('/');
    }
  });
};

const findbyUsername = async (req, res, next) => {
  let name = req.body.name;

  User.find({ username: name }, function (err, user) {

    if (err) {
      console.log(err);
      res.send(err);
    } else if (typeof user === "undefined" || user === null) {

      res.json({
        code: "304",
        message: "Invalid Username!",
      });

    } else {
      
      return res.json(user);
     
    }
  });
};


const getUserData = (req,res) => {
  const token = req.headers["x-access-token"];

  //console.log("token444", token);

  let decodedValue = decodingJWT(token);

  //console.log("decodedValue", decodedValue);

  if(!decodedValue){
    res.status(500).send("Token not found");
  }else{
    User.find({ _id: decodedValue.id }, function (err, user) {
      if (err) {
        console.log(err);
        return res.status(400).send({status:"error",message:err});
      } 
      else if (typeof user === "undefined" || user === null) {
        res.status(304).send({
          status: "error",
          message: "Error : Enter valid email!",
        });
      } else {
        let userInfo = user[0];
        userInfo["password"] = null;
        return res.status(200).send({status:"ok",user:userInfo});
      }
    });
  }

  // res.status(200).end();
}

const decodingJWT = (token) => {
  
  if(token !== null || token !== undefined){
   const base64String = token.split(".")[1];
   const decodedValue = JSON.parse(Buffer.from(base64String,    
                        'base64').toString('ascii'));
   console.log(decodedValue);
   return decodedValue;
  }
  return null;
}



const processUpdateUser = (req, res, next) => {
  let id = req.params.id

  User.find({"_id":id}, (err, user) => {
      if(err){
          console.log(err);
          res.end(err);
      }else{   
          
          let userInfo = user[0];

          let updatedUser = User({
          "_id": id,
          "firstName": req.body.firstName,
          "lastName": req.body.lastName,
          "contact": req.body.contact,
          "email": req.body.email,
          "username": userInfo.username,
          "password":userInfo.password,
          "userType":userInfo.userType,
          "updatedOn": new Date()
          });

          User.updateOne({_id: id}, updatedUser, (err) => {
                  if(err){
                      console.log(err);
                      res.end(err);
                  }else{
                    console.log("user updated.")
                    // res.status(200).send('ok');
                    res.send(updatedUser);
                  }
              });
          }
  });
}

module.exports = { createNewUser, userLogin, findByEmail, findbyUsername, getUserData, processUpdateUser };

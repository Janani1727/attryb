const express = require("express");
const { UserModel } = require("../model/user.model")
const jswt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (user.length > 0) {

     

      res.status(200).send({ msg: "User Already Exists" });
    } else {

      

      bcrypt.hash(password, 5, async (error, hash) => {
        if (error) {
          res.status(200).send({ msg: error });
        } else {
          let newUser = UserModel({ name, email, password: hash });
          await newUser.save();
          let findUser = await UserModel.find({ email });

         
          jswt.sign({ id: findUser[0]._id }, "janani", async (err, token) => {
            if (err) {
              res.status(200).send({ msg: error });
            } else {
       
              res.send({
                msg: "User Registered Successfully",
                token,
                name: findUser[0].name, // Include the user's name in the response
              });
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await UserModel.find({ email });

    // If user doesn't exist
    if (user.length < 1) {
      return res.status(404).send({ msg: "User Does Not Exist" });
    }

    // Compare password using bcrypt
    bcrypt.compare(password, user[0].password, async (error, result) => {
      if (error) {
        return res.status(500).send({ msg: "An error occurred while validating the password" });
      } 
      
      if (result === true) {
        // If password is correct, generate JWT token
        jswt.sign({ id: user[0]._id }, "janani", async (err, token) => {
          if (err) {
            return res.status(500).send({ msg: "Error generating token" });
          }
          return res.status(200).send({
            msg: "User Logged In Successfully",
            token,
            name: user[0].name, // Include the user's name in the response
          });
        });
      } else {
        return res.status(401).send({ msg: "Password Is Incorrect" });
      }
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).send({ msg: "Server Error", error: error.message });
  }
});





module.exports = { userRouter };
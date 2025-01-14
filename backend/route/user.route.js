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

  let user = await UserModel.find({ email });
  try {
   

    if (user.length < 1) {
      res.status(200).send({ msg: "User Does Not Exists" });
    } else {
      bcrypt.compare(password, user[0].password, async (error, result) => {
        if (error) {
          res.status(200).send({ msg: error });
        } else if (result === true) {

          jswt.sign({ id: user[0]._id }, "janani", async (err, token) => {
            if (err) {
              res.status(200).send({ msg: error });
            } else {
              res.status(200).send({
                msg: "User Logged In Successfully",
                token,
                name: user[0].name, // Include the user's name in the response
              });
            }
          });
        } else {
          res.status(200).send({ msg: "Password Is Wrong" });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});




module.exports = { userRouter };
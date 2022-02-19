const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const userSchema = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

router.post(
  "/signup",
  [
    check("firstname", "firstname is required").exists(),
    check("lastname", "lastname is required").exists(),
    check("email", "email is required").isEmail(),
    check("password", "password is required").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req.body);
    console.log("okk", req.body);

    if (errors.length) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }

    const user = new userSchema(req.body);
    user.save((err, save) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "somthing wrong in DB",
        });
      }

      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      res.cookie("token", token, { expire: new Date() + 9999 });

      res.json({
        name: user.name,
        email: user.email,
        id: user._id,
        token: token,
      });
    });
  }
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req.body);

    if (errors.length) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }
    const { email, password } = req.body;

    userSchema.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }

      if (!user.autheticate(password)) {
        return res.status(400).json({
          error: "wrong password",
        });
      }

      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      res.cookie("token", token, { expire: new Date() + 9999 });

      console.log(token);

      return res.json({
        user: user.firstname,
        id: user._id,
        token: token,
      });
    });
  }
);

module.exports = router;

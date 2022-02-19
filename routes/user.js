const express = require("express");
const router = express.Router();
const userSchema = require("../models/userSchema");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const isSigndIn = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(200).json({ success: false, message: "Token Not Valid." });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log(decodedToken);
  // return decodedToken;
  if (decodedToken) {
    next();
  }
};

router.get("/alluser", isSigndIn, function (req, res) {
  // isSigndIn(req);
  userSchema
    .find({})
    .select("firstname lastname email createdAt")
    .exec(function (err, users) {
      if (err) return res.status(400).json({ error: "No User" });
      return res.json({ users: users });
    });
});

module.exports = router;

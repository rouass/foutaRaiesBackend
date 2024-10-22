const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const checkauth = require("../middleware/check-user");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts, please try again later.",
});

router.post("/login", limiter, async (req, res, next) => {
  try {
    let fetchedUser = await User.findOne({ phone: req.body.phone });

    if (!fetchedUser) {
      return res.status(401).json({ message: "Incorrect phone or password!" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, fetchedUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect phone or password!" });
    }

    const token = jwt.sign(
      { role: fetchedUser.roles[0], userId: fetchedUser._id },
      "secret_this_should_be_longer_secret_this_should_be_longer_",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      userName: fetchedUser.name,
      userPicture: fetchedUser.imgPath,
      userRole: fetchedUser.roles[0],
    });
  } catch (error) {
    console.error("Authentication error:", error);

    next(error);
  }
});


  router.get("/admin/devis", checkauth, (req, res, next) => {
    if (req.userData.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    Devis.find()
      .then((devisList) => {
        res.status(200).json(devisList);
      })
      .catch((err) => {
        res.status(500).json({ message: "Fetching devis failed!" });
      });
  });
  

router.post("/addUser", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
      roles: ["admin"]  // Explicitly assign "admin" role
    });
    user.save()
      .then((result) => {
        res.status(201).json({
          message: "Admin created!",
          result: result
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Failed to create admin",
          error: error
        });
      });
  });
});


  module.exports = router;
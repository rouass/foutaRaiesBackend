const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const checkauth = require("../middleware/check-user");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

router.post("/login", limiter, (req, res, next) => {
    let fetchedUser;
  
    User.findOne({ phone: req.body.phone })
      .then((user) => {
        if (!user) {
          throw new Error("Incorrect phone or password!");
        }
  
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then((result) => {
        if (!result) {
          throw new Error("Incorrect phone or password!");
        }
  
        const token = jwt.sign(
          { role: fetchedUser.roles[0] , userId: fetchedUser._id },
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
      })
      .catch((err) => {
        console.error("Authentication error:", err);
  
        res.status(401).json({
          message: "Authentication failed. Incorrect phone or password.",
        });
      });
  });

  router.get("/admin/devis", checkauth, (req, res, next) => {
    if (req.userData.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Admins only." });
    }
  
    // Logic for fetching and returning devis for admin
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
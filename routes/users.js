// ======== Import Required Modules ========

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// ======== Load User Model ========
require("../models/User");
require("../models/FacultyMember");
require('../models/Student');
// const student = mongoose.model('students');
const User = mongoose.model("users");
const FacultyMember = mongoose.model("facultyMembers");
const Student = mongoose.model("students");

// ======== ROUTES ========

// Load "Login" Page
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Load "Signup" Page
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// "Logout"
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

// Post "Login" User Form
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    /**
     * Redirect To The Right View According To User Type (Faculty Member 
     * Or Student
     */
    User.findOne({ email: req.body.email }) // Find user via email
      .then(user => {
        if (user.userType === "facultyMember") {
          res.redirect("/dashboards/facultyMember");
        } else {
          res.redirect("/dashboards/student");
        }
      });
  }
);

// Post "Sign Up" User Form
router.post("/signup", (req, res, next) => {
  // -------- Password Form Validation --------
  let errors = [];

  // If password doesn't much
  if (req.body.password1 != req.body.password2) {
    errors.push({ text: "Password do not match" });
  }

  // If password is less than 6 characters
  if (req.body.password1.length < 6) {
    errors.push({ text: "Password must be at least 6 characters" });
  }

  // If there are errors about password
  if (errors.length > 0) {
    // Reload the "Signup" page
    res.render("users/signup", {
      errors: errors,
      fullName: req.body.fullName,
      email: req.body.email,
      password1: req.body.password1,
      password2: req.body.password2
    });
  } else {
    // -------- User Existance Form Validation --------
    User.findOne({ email: req.body.email }).then(user => {
      // Check if there is the same email in database
      if (user) {
        // If there is one, flash error
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/signup");
      } else {
        // -------- Save "New User" In Database --------
        // Create a new user object
        const newUser = new User({
          name: req.body.fullName,
          email: req.body.email,
          password: req.body.password1,
          userType: req.body.userType
        });

        // Encrypt the new User's password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            // Save the new User to the database
            newUser.save().then(user => {
              if (req.body.userType === "facultyMember") {
                // ---- Create Faculty Member ----
                // Prepare data for saving
                const newMember = {
                  userID: user._id
                };
                // Save data to the database
                new FacultyMember(newMember).save();
              } else {
                // ---- Create Student ----
                // Prepare data for saving
                const newMember = {
                  userID: user._id
                };
                // Save data to the database
                new Student(newMember).save();
              }
              req.flash("success_msg", "You are now register");
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  }
});

// ======== Export module ========

module.exports = router;

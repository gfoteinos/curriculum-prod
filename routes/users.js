// ======== Import Required Modules ========

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// ======== Load User Model ========
require("../models/User");
require("../models/FacultyMember");
// require('../models/Student');
// const student = mongoose.model('students');
const User = mongoose.model("users");
const FacultyMember = mongoose.model("facultyMembers");

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

// Load "Login" User Form
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    // Find user via email
    User.findOne({ email: req.body.email })
      // Redirect to the right view according to user type (faculty member or not)
      .then(user => {
        if (user.userType === "facultyMember") {
          // Relate the user with the faculty member 
          FacultyMember.find({}).then(members => {
            if(members) {
              members.forEach(member => {
                if(member.userID === "" || member.userID === undefined) {
                  /* If there is faculty member with no 'userID' then fill in
                   * the one with the id of the login user  
                   */
                  member.userID = user._id;
                  // Save changes
                  member.save();
                }
              });
            }
          });

          res.redirect("/dashboards/facultyMember");
        } else {
          res.redirect("/dashboards/student");
        }
      });
  }
);

// Load "Sign Up" User Form
router.post("/signup", (req, res, next) => {
  // ---- Hundle "sign up" errors ----
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
    // Check if there is the same email in database
    User.findOne({ email: req.body.email }).then(user => {
      // If there is one, flash error
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/signup");
      } else {
        // ---- Save the "new user" in database ----
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

            // Save the newUser to the database
            newUser.save()
              .then(user => {
                req.flash("success_msg", "You are now register");
                res.redirect("/users/login");
              });
          });
        });
      }
    });
  }
});

// // Login user form
// router.post('/login', (req, res, next) => {
//   // ---- Authenticate user with "passport" ----
//   // Use "local" strategy
//   User.findOne({ email: req.body.email })
//     .then(user => {
//       if(user.userType = 'facultyMember') {
//         passport.authenticate('local', {
//           successRedirect: '/dashboards/facultyMember',
//           failureRedirect: '/users/login',
//           failureFlash: true
//         })(req, res, next);
//       } else {
//         passport.authenticate('local', {
//           successRedirect: '/dashboards/student',
//           failureRedirect: '/users/login',
//           failureFlash: true
//         })(req, res, next);
//       }
//     })
// });

// ======== Export module ========

module.exports = router;

// ======== Import Required Modules ========

const express = require('express');
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const passport = require('passport');
const router = express.Router();

// ======== Load User Model ========

require('../models/User');
const User = mongoose.model('users');

// ======== Routes ========

// Load faculty member dashboard
router.get('/facultyMember', (req, res) => {
  console.log(`req.user: ${req.user}`);
  const user = req.user;
  res.render('dashboards/facultyMember', {
    user
  });
  // console.log(`user: ${user}`);
  // console.log(`user name: ${user.name}`);
  
  // // ---- It works ----
  // const user = {
  //   name: req.user.name,
  //   email: req.user.email
  // };
  // res.render('dashboards/facultyMember', {
  //   user
  // });
  // // --------------------------------------
  
  // console.log(req.user[0].name);
  // console.log(user);
  // console.log(user.name);
  // console.log(req.user.name);
  // User.find({ email: req.user.email })
  //   .then(user => {
  //     res.render('dashboards/facultyMember', {
  //       user: user
  //     });
  //     // console.log(user[0].name);
  //     // console.log(user);
  //     // console.log(user.name);
  //   })
    
});

// Load student dashboard
router.get('/student', (req, res) => {
  res.render('dashboards/student');
});


// ======== Export module ========

module.exports = router;
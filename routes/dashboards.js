// ======== Import Required Modules ========

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const router = express.Router();
const multer = require('multer'); // Used for uploading files

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/facultyMembers')
  },
  filename: function (req, file, cb) {
    let extsn = file.mimetype;
    extsn = extsn.split('/');
    cb(null, file.fieldname + '-' + Date.now() + '.' + extsn[1])
  }
})

const uploadFacultyMember = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }
});

const upload = uploadFacultyMember.single('photo');
// const uploadFacultyMember = multer({ dest: './public/img/facultyMembers' })
// const uploadStudent = multer({ dest: './public/img/students' })
// const uploadCourse = multer({ dest: './public/img/courses' })

// ======== Load User Model ========

require('../models/User');
const User = mongoose.model('users');


// ======== Routes ========

// Load faculty member dashboard
router.get('/facultyMember', (req, res) => {
  // Create a faculty member object
  const faculty = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    officeNumber: req.user.officeNumber,
    photo: req.user.photo,
    bio: req.user.bio,
    facebook: req.user.facebook,
    twitter: req.user.twitter,
    linkedin: req.user.linkedin
  };
  // Pass the user to the view
  res.render('dashboards/facultyMember', {
    faculty
  });
});

// Load student dashboard
router.get('/student', (req, res) => {
  // Create a student object
  const student = {
    name: req.user.name,
    email: req.user.email
  };
  // Pass the user to the view
  res.render('dashboards/student', {
    student
  });
});

// Update email 
router.put('/facultyMember/email/:id', (req, res) => {
  // Check if the input email has already registered to another account
  User.findOne({ email: req.body.email })
    .then(user => {
      // If true trigger an error message and stop
      if (user) {
        req.flash('error_msg', 'Email has already registered. Please enter a another email.');
        res.redirect('/dashboards/facultyMember');
      } else {
        // Find the user via id 
        User.findOne({ _id: req.params.id })
          .then(user => {
            if (user) {
              // Update the email with the new one 
              user.email = req.body.email;
              user.save()
                .then(user => {
                  req.flash('success_msg', 'Email has been updated');
                  res.redirect('/dashboards/facultyMember');
                })
            }
          })
      }
    })
});

// Update password 
router.put('/facultyMember/password/:id', (req, res) => {
  // Fetch the current password from the database 
  User.findOne({ _id: req.params.id })
    .then(user => {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        // If match update password else trigger error message
        if (isMatch) {
          // -------- Update the password --------
          // If "new password & re-type password" doesn't much 
          if (req.body.password1 != req.body.password2) {
            req.flash('error_msg', '"New password" and "Re-type new password" does not match');
            res.redirect('/dashboards/facultyMember');
          } else {
            // If new password is less than 6 characters 
            if (req.body.password1.length < 4) {
              req.flash('error_msg', 'Password must be at least 6 characters');
              res.redirect('/dashboards/facultyMember');
            } else {
              // Change password with the new one 
              user.password = req.body.password1;
              // Encrypt the new password
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                  if (err) throw err;
                  user.password = hash;
                  // Save the new password to the database 
                  user.save()
                    // Then redirect to the "faculty member" page
                    .then(user => {
                      req.flash('success_msg', 'Password has been updated');
                      res.redirect('/dashboards/facultyMember');
                    })
                });
              });
            }
          }
        } else {
          // Trigger error message and reload the page
          req.flash('error_msg', 'Current password does not match');
          res.redirect('/dashboards/facultyMember');
        }
      });
    })
});

// Update profile 
router.put('/facultyMember/profile/:id', (req, res) => {
  upload(req, res, function (err) {
    let error = '';

    // ---- Handle uploading photo errors ----
    if (err instanceof multer.MulterError) {
      error = `Error uploading photo: ${err.message}`;
    } else if (err) {
      error = `An unknown error occurred when uploading.`;
    }

    // ---- Handle form fields errors ----
    // Check if the there are any required form fields empty 
    if (req.body.fullName === '' || req.body.phone === '' || req.body.officeNumber === '' || req.body.bio === '') {
      error = 'One or more of the fields "Full Name, Phone, Office, Bio" are empty. Please fill in the fields where missing.';

      // // Trigger error message & redirect back to the page  
      // req.flash('error_msg', 'One or more of the fields "Full Name, Phone, Office, Bio" are empty. Please fill in the fields where missing.');
      // res.redirect('/dashboards/facultyMember');
    }

    // If error flash error message & redirect back to the page 
    if (error != '') {
      req.flash('error_msg', error);
      res.redirect('/dashboards/facultyMember');
    } else {
      // console.log(req.file)
      // console.log(upload)
      // console.log(req.user);
      // let extsn = req.file.mimetype;
      // extsn = extsn.split('/');
      // console.log(extsn[1]);

      // Find the user via id 
      User.findOne({ _id: req.params.id })
        .then(user => {
          // ---- Fill in photo in diferent cases ----
          let photo;
          // In case of uploding a profile photo 
          if (req.file) {
            photo = req.file.filename;
          } else {
            // In case of delete profile photo 
            if (req.body.deletePhoto) {
              photo = '';
            } else {
              // In case of neither of above 
              photo = req.user.photo;
            }
          }
          // ---- Update the user's profile info ----  
          // Basics 
          user.name = req.body.fullName;
          user.phone = req.body.phone;
          user.officeNumber = req.body.officeNumber
          user.photo = photo;
          // Bio 
          user.bio = req.body.bio;
          // Social 
          user.facebook = req.body.facebook;
          user.twitter = req.body.twitter;
          user.linkedin = req.body.linkedin;

          // Save to the database 
          user.save()
            .then(user => {
              req.flash('success_msg', 'Profile updated.');
              res.redirect('/dashboards/facultyMember')
            })
            // Catch any errors 
            .catch(err => {
              console.log(err);
              return;
            })
        })
    }
  });
});


// ======== Export module ========

module.exports = router;
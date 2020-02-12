
// ======== Import Required Modules ========
// Define the Strategy 
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// ======== Load User Model ========

const User = mongoose.model('users');


// ======== Export Passport ======== 

module.exports = function(passport) {
  // User Authentication
  passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password1'}, (email, password, done) => {
    // Find a user via email 
    User.findOne({
      email: email
    }). then(user => {
      // If no user found trigger error message  
      if(!user) {
        return done(null, false, { message: 'No user found' });
      }

      // Check input password with one from database 
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        // If match return the user else trigger error message 
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password Incorrect' });
        }
      });
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
} 



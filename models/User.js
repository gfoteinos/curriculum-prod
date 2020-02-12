
// ==== Import Mongoose & Define A Schema ====
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ======== Create A Schema ========
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  officeNumber: {
    type: String,
    required: false
  },
  photo: {
    type: String
  },
  bio: {
    type: String,
    required: false
  },
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  linkedin: {
    type: String
  }
});


// ==== Create A Model & Connect It To The Schema ====
mongoose.model('users', UserSchema);
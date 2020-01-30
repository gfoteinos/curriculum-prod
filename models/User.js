
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
  }
});


// ==== Create A Model & Connect It To The Schema ====
mongoose.model('users', UserSchema);
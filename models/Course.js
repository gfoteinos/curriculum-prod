
// ==== Import Mongoose & Define A Schema ====
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ======== Create A Schema ========
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});


// ==== Create A Model & Connect It To The Schema ====
mongoose.model('courses', CourseSchema);
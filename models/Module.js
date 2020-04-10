
// ==== Import Mongoose & Define A Schema ====
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ======== Create A Schema ========
const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  courseID: {
    // Relation with the 'courses' collection
    type: Schema.Types.ObjectId,
    ref: 'courses'
  },
  course: {
    type: String,
    required: false
  },
  degree: {
    type: String,
    required: false
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
mongoose.model('modules', ModuleSchema);
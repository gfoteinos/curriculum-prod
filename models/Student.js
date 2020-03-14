
// ==== Import Mongoose & Define A Schema ====
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// ======== Create A Schema ========
const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  course: {
    // Relation with the 'users' collection
    type: Schema.Types.ObjectId,
    ref: 'courses'
  },
  degree: {
    // Relation with the 'users' collection
    type: Schema.Types.ObjectId,
    ref: 'courses'
  }
});


// ==== Create A Model & Connect It To The Schema ====
mongoose.model('modules', ModuleSchema);
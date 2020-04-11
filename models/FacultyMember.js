// ==== Import Mongoose & Define A Schema ====
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ======== Create A Schema ========
const FacultyMemberSchema = new Schema({
  userID: {
    // Relation with the 'users' collection
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  academicRank: {
    type: String
  },
  officeNumber: {
    type: String
  },
  taughtModules: [{
    // Relation with the 'modules' collection
    type: Schema.Types.ObjectId,
    ref: "modules"
  }]
});

// ==== Create A Model & Connect It To The Schema ====
mongoose.model("facultyMembers", FacultyMemberSchema);

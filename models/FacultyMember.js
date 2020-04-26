// ==== Import Mongoose & Define A Schema ====
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ======== Create A Schema ========
const FacultyMemberSchema = new Schema({
  userID: {
    // Relation with the 'users' collection
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  academicRank: {
    type: String
  },
  officeNumber: {
    type: String
  },
  taughtModules: [{
    moduleID: {
      // Relation with the 'modules' collection
    type: Schema.Types.ObjectId,
    ref: "modules"
    },
    coursework: {
      date: {
        type: Date
      }
    }
  }]
});

// ==== Create A Model & Connect It To The Schema ====
mongoose.model("facultyMembers", FacultyMemberSchema);

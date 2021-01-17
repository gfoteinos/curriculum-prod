// ==== Import Mongoose & Define A Schema ====
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ======== Create A Schema ========
const StudentSchema = new Schema({
  userID: {
    // Relation with the 'users' collection
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  taughtModules: [{
    taughtModuleID: {
      // Relation with the 'modules' collection
    type: Schema.Types.ObjectId,
    ref: "modules"
    },
    coursework: {
      date: {
        type: Date
      }
    },
    exam: {
      date: {
        type: Date
      },
      classroom: {
        type: String
      }
    }
  }]
});

// ==== Create A Model & Connect It To The Schema ====
mongoose.model("students", StudentSchema);

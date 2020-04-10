// ======== Import Required Modules ========

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const passport = require('passport');
const router = express.Router();
const multer = require("multer"); // Used for uploading files

/**
 * On that version the "multer" works perfect for uploading images to heroku
 */

// ======== UPLOAD IMAGES ========
// ---- Set Storage Engine ----
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, './public/img/facultyMembers')
    cb(null, path.join(__dirname, "../public", "img", "facultyMembers"));
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + path.extname(file.originalname)
    );
  }
});

// ---- Init Upload ----
const upload = multer({
  storage: storage,
  // File size 3MB only
  limits: { fileSize: 3000000 },
  // Only images are allowed
  fileFilter: function(req, file, cb) {
    // Allowed Extentions
    const filetypes = /jpeg|jpg|png|gif/;

    // Check Extentions
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Check Mime Type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only image files are allowed to upload");
    }
  }
}).single("photo");

// ======== LOAD MODELS ========
require("../models/User");
require("../models/Course");
require("../models/Module");
const User = mongoose.model("users");
const Course = mongoose.model("courses");
const Module = mongoose.model("modules");

// ======== ROUTES ========
// Load Faculty Member Dashboard
router.get("/facultyMember", (req, res) => {
  // -------- Create A Faculty Member Object --------
  const faculty = {
    id: req.user.id,
    name: req.user.name,
    academicRank: req.user.academicRank,
    email: req.user.email,
    phone: req.user.phone,
    officeNumber: req.user.officeNumber,
    photo: req.user.photo,
    bio: req.user.bio,
    facebook: req.user.facebook,
    twitter: req.user.twitter,
    linkedin: req.user.linkedin
  };

  // -------- Get All Courses --------
  Course.find({})
    .sort({ name: "asc" })
    .then(courses => {
      let listCourses = []; // For "Courses" table in "Courses" form
      if (courses) {
        // Fill in "Courses" table to pass it later in the view
        let counter = 1;
        courses.forEach(course => {
          listCourses.push({
            aa: counter,
            id: course._id,
            name: course.name,
            degree: course.degree,
            color: course.color,
            description: course.description
          });
          counter++;
        });
      }

      // -------- Get All Modules --------
      Module.find({})
        .populate("courseID")
        .sort({ name: "asc" })
        .then(modules => {
          let listModules = []; // For "Modules" table in "Modules" form
          if (modules) {
            // Fill in "Modules" table to pass it later in the view
            let counter = 1;
            modules.forEach(module => {
              listModules.push({
                aa: counter,
                id: module._id,
                name: module.name,
                course: module.courseID.name,
                degree: module.courseID.degree,
                color: module.color,
                description: module.description
              });
              counter++;
            });
          }

          // -------- Pass Data Sets To The View --------
          res.render("dashboards/facultyMember", {
            faculty,
            listCourses,
            listModules
          });
        });
    });
});

// Load Student Dashboard
router.get("/student", (req, res) => {
  // Create a student object
  const student = {
    name: req.user.name,
    email: req.user.email
  };
  // Pass the user to the view
  res.render("dashboards/student", {
    student
  });
});

// Update Email
router.put("/facultyMember/email/:id", (req, res) => {
  // Check if the input email has already registered to another account
  User.findOne({ email: req.body.email }).then(user => {
    // If true trigger an error message and stop
    if (user) {
      req.flash(
        "error_msg",
        "Email has already registered. Please enter another email."
      );
      res.redirect("/dashboards/facultyMember");
    } else {
      // Find the user via id
      User.findOne({ _id: req.params.id }).then(user => {
        if (user) {
          // Update the email with the new one
          user.email = req.body.email;
          user.save().then(user => {
            req.flash("success_msg", "Email has been updated.");
            res.redirect("/dashboards/facultyMember");
          });
        }
      });
    }
  });
});

// Update Password
router.put("/facultyMember/password/:id", (req, res) => {
  // Fetch the current password from the database
  User.findOne({ _id: req.params.id }).then(user => {
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;
      // If match update password else trigger error message
      if (isMatch) {
        // -------- Update the password --------
        // If "new password & re-type password" doesn't much
        if (req.body.password1 != req.body.password2) {
          req.flash(
            "error_msg",
            '"New password" and "Re-type new password" does not match.'
          );
          res.redirect("/dashboards/facultyMember");
        } else {
          // If new password is less than 6 characters
          if (req.body.password1.length < 4) {
            req.flash("error_msg", "Password must be at least 6 characters.");
            res.redirect("/dashboards/facultyMember");
          } else {
            // Change password with the new one
            user.password = req.body.password1;
            // Encrypt the new password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                // Save the new password to the database
                user
                  .save()
                  // Then redirect to the "faculty member" page
                  .then(user => {
                    req.flash("success_msg", "Password has been updated.");
                    res.redirect("/dashboards/facultyMember");
                  });
              });
            });
          }
        }
      } else {
        // Trigger error message and reload the page
        req.flash("error_msg", "Current password does not match.");
        res.redirect("/dashboards/facultyMember");
      }
    });
  });
});

// Update Profile
router.put("/facultyMember/profile/:id", (req, res) => {
  upload(req, res, function(err) {
    let error = "";

    // ---- Handle uploading photo errors ----
    if (err instanceof multer.MulterError) {
      error = `Error uploading photo: ${err.message}`;
    } else if (err) {
      error = err; // Error: Only image files are allowed to upload
      //see: "---- Init Upload ----" at "==== Upload Images ====" section
    }

    // ---- Handle form fields errors ----
    // Check if the there are any required form fields empty
    if (
      req.body.fullName === "" ||
      req.body.academicRank === "" ||
      req.body.phone === "" ||
      req.body.officeNumber === "" ||
      req.body.bio === ""
    ) {
      error =
        'One or more of the fields "Full Name, Academic Rank, Phone, Office, Bio" are empty. Please fill in the fields where missing.';
    }

    // If error flash error message & redirect back to the page
    if (error != "") {
      req.flash("error_msg", error);
      res.redirect("/dashboards/facultyMember");
    } else {
      // Find the user via id
      User.findOne({ _id: req.params.id }).then(user => {
        // ---- Fill in photo in different cases ----
        let photo;
        // In case of uploading a profile photo
        if (req.file) {
          photo = req.file.filename;
        } else {
          // In case of delete profile photo
          if (req.body.deletePhoto) {
            photo = "";
          } else {
            // In case of neither of above
            photo = req.user.photo;
          }
        }
        // ---- Update the user's profile info ----
        // Basics
        user.name = req.body.fullName;
        user.academicRank = req.body.academicRank;
        user.phone = req.body.phone;
        user.officeNumber = req.body.officeNumber;
        user.photo = photo;
        // Bio
        user.bio = req.body.bio;
        // Social
        user.facebook = req.body.facebook;
        user.twitter = req.body.twitter;
        user.linkedin = req.body.linkedin;

        // Save to the database
        user
          .save()
          .then(user => {
            req.flash("success_msg", "Profile has been updated.");
            res.redirect("/dashboards/facultyMember");
          })
          // Catch any errors
          .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect("/dashboards/facultyMember");
            return;
          });
      });
    }
  });
});

// Create Course
router.post("/facultyMember/courses/", (req, res) => {
  // Get Rid Of Spaces Before & After The End Of "Course Title"
  let bodyNameArray = req.body.name.match(/\S.*\S/g);
  let bodyName;
  if (bodyNameArray) {
    bodyName = bodyNameArray[0];
  } else {
    bodyName = "";
  }

  var error = "";
  // ======== Error Handling ========
  // -------- Form fields errors --------
  // When required form fields are empty
  if (
    bodyName === "" ||
    req.body.degree === undefined ||
    req.body.color === "" ||
    req.body.description === ""
  ) {
    error =
      "One or more of the form's fields are empty. Please fill in the form fields where missing.";
    req.flash("error_msg", error);
    res.redirect("/dashboards/facultyMember");
  } else {
    // Course already exist
    Course.findOne({
      $and: [{ name: bodyName }, { degree: req.body.degree }]
    })
      .then(course => {
        if (course) {
          if (course.name === bodyName && course.degree === req.body.degree) {
            error = "Course already exist.";
            req.flash("error_msg", error);
            res.redirect("/dashboards/facultyMember");
          }
        } else {
          // ======== Add data to the database ========
          // ---- Prepare data for saving ----
          const newCourse = {
            name: bodyName,
            degree: req.body.degree,
            color: req.body.color,
            description: req.body.description
          };
          // ---- Save data to the database ----
          new Course(newCourse)
            // Save & Redirect with success message
            .save()
            .then(course => {
              req.flash("success_msg", "New course added.");
              res.redirect("/dashboards/facultyMember");
            });
        }
      })
      // Catch any errors
      .catch(err => {
        req.flash("error_msg", err.message);
        res.redirect("/dashboards/facultyMember");
        return;
      });
  }
});

// Edit Course
router.put("/facultyMember/courses/:id", (req, res) => {
  // Get all courses
  Course.find({})
    .then(courses => {
      // ======== ERROR HANDLING ========
      // Initialize the error
      let error = "";

      // ---- Course already exist ----
      courses.forEach(course => {
        // Convert object_id to string
        const courseID = course._id.toString();
        if (
          courseID !== req.params.id &&
          course.name === req.body.name &&
          course.degree === req.body.degree
        ) {
          error = `Fail to update. There is another "Course" with the same "Title" and "Level". Click the edit button again to retry.`;
        }
      });

      // ---- Nothing To Update. No Changes ----
      courses.forEach(course => {
        // Convert object_id to string
        const courseID = course._id.toString();
        if (
          courseID === req.params.id &&
          course.name === req.body.name &&
          course.degree === req.body.degree &&
          course.color === req.body.color &&
          course.description === req.body.description
        ) {
          error = `Fail to update. There are not any changes. To edit a "Course" click the edit button again to retry.`;
        }
      });

      // -------- In Case Of Errors --------
      // Flash error message & redirect back to the page
      if (error !== "") {
        req.flash("error_msg", error);
        res.redirect("/dashboards/facultyMember");
      } else {
        // ======== UPDATE THE "COURSE" INFO ========
        Course.findOne({ _id: req.params.id })
          .then(course => {
            course.name = req.body.name;
            course.degree = req.body.degree;
            course.color = req.body.color;
            course.description = req.body.description;
            // Save changes
            course.save().then(course => {
              // Flash success message & redirect back to the page
              req.flash("success_msg", "Course has been updated.");
              res.redirect("/dashboards/facultyMember");
            });
          })
          // Catch any errors
          .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect("/dashboards/facultyMember");
            return;
          });
      }
    })
    // Catch any errors
    .catch(err => {
      req.flash("error_msg", err.message);
      res.redirect("/dashboards/facultyMember");
      return;
    });
});

// Delete Course
router.delete("/facultyMember/courses/", (req, res) => {
  // ======== Delete Courses ========
  // Get the selected course ids
  let ids = req.body.ids;

  /* In case of only one "course" is selected to delete the "id" is a string.
   *  In order to delete the "course" it needs to be converted to an array of
   *  one object.
   */
  //  Convert to an array of one object
  if (typeof ids === "string") {
    let idArray = [];
    idArray.push(ids);
    ids = idArray;
  }

  // Delete the courses from the database
  ids.forEach(id => {
    Course.deleteOne({ _id: id })
      // Catch any errors
      .catch(err => {
        req.flash("error_msg", err.message);
        res.redirect("/dashboards/facultyMember");
        return;
      });
  });

  // ======== Flash Success Message & Redirect Back To The Page ========
  req.flash("success_msg", "Courses deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

// Create Module
router.post("/facultyMember/modules/", (req, res) => {
  // ---- Get Rid Of Spaces Before & After The End Of "Module Name" ----
  let bodyNameArray = req.body.name.match(/\S.*\S/g);
  let bodyModuleName;
  if (bodyNameArray) {
    bodyModuleName = bodyNameArray[0];
  } else {
    bodyModuleName = "";
  }

  // ======== ERROR HANDLING ========
  // -------- Form Fields Errors --------
  if (bodyModuleName === "" || req.body.courseID === undefined) {
    // When required form fields are empty
    error =
      '"Module Name" or "Course Name" are missing. Please fill in the form fields where missing.';
    req.flash("error_msg", error);
    res.redirect("/dashboards/facultyMember");
  } else {
    // Module already exist
    Module.findOne({
      $and: [{ name: bodyModuleName }, { courseID: req.body.courseID }]
    }).then(module => {
      if (module) {
        error = "Module already exist.";
        req.flash("error_msg", error);
        res.redirect("/dashboards/facultyMember");
      } else {
        // ======== ADD DATA TO THE DATABASE ========
        // ---- Prepare data for saving ----
        const newModule = {
          name: bodyModuleName,
          courseID: req.body.courseID,
          color: req.body.color,
          description: req.body.description
        };
        // ---- Save data to the database ----
        new Module(newModule)
          // Save & Redirect with success message
          .save()
          .then(module => {
            req.flash("success_msg", "New module added.");
            res.redirect("/dashboards/facultyMember");
          });
      }
    });
  }
});

// Edit Module
router.put("/facultyMember/modules/:id", (req, res) => {
  // Get all Modules
  Module.find({})
    .then(modules => {
      // ======== ERROR HANDLING ========
      // Initialize the error
      let error = "";

      let moduleID;
      let moduleCourseID;
      // -------- Module Already Exist --------
      modules.forEach(module => {
        // Convert object_id to string
        moduleID = module._id.toString();
        moduleCourseID = module.courseID.toString();
        if (
          moduleID !== req.params.id &&
          moduleCourseID === req.body.courseID &&
          module.name === req.body.name
        ) {
          error = `Fail to update. There is another "Module" with the same "Title" and "Course". Click the edit button again to retry.`;
        }
      });

      // -------- Nothing To Update. No Changes --------
      modules.forEach(module => {
        // Convert object_id to string
        moduleID = module._id.toString();
        moduleCourseID = module.courseID.toString();
        if (
          moduleID === req.params.id &&
          module.name === req.body.name &&
          moduleCourseID === req.body.courseID &&
          module.color === req.body.color &&
          module.description === req.body.description
        ) {
          error = `Fail to update. There are not any changes. To edit a "Module" click the edit button again to retry.`;
        }
      });

      // -------- In Case Of Errors --------
      // Flash error message & redirect back to the page
      if (error !== "") {
        req.flash("error_msg", error);
        res.redirect("/dashboards/facultyMember");
      } else {
        // ======== UPDATE THE "MODULE" INFO ========
        Module.findOne({ _id: req.params.id })
          .then(module => {
            module.name = req.body.name;
            module.courseID = req.body.courseID;
            module.color = req.body.color;
            module.description = req.body.description;
            // Save changes
            module.save().then(module => {
              // Flash success message & redirect back to the page
              req.flash("success_msg", "Module has been updated.");
              res.redirect("/dashboards/facultyMember");
            });
          })
          // Catch any errors
          .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect("/dashboards/facultyMember");
            return;
          });
      }
    }) // Catch any errors
    .catch(err => {
      req.flash("error_msg", err.message);
      res.redirect("/dashboards/facultyMember");
      return;
    });
});

// Delete Module
router.delete("/facultyMember/modules/", (req, res) => {
  // ======== Delete Modules ========
  // Get the selected module ids
  let ids = req.body.ids;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  Convert to an array of one object
  if (typeof ids === "string") {
    let idArray = [];
    idArray.push(ids);
    ids = idArray;
  }

  // Delete the modules from the database
  ids.forEach(id => {
    Module.deleteOne({ _id: id })
      // Catch any errors
      .catch(err => {
        req.flash("error_msg", err.message);
        res.redirect("/dashboards/facultyMember");
        return;
      });
  });

  // ======== Flash Success Message & Redirect Back To The Page ========
  req.flash("success_msg", "Modules deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

// console.log(`db.id: ${typeof(courseID)} - req.param.id: ${typeof(req.params.id)}, db.name: ${typeof(course.name)} - req.body.name: ${typeof(req.body.name)}, db.degree: ${typeof(course.name)} - req.body.degree: ${typeof(req.body.degree)}`);

// ======== EXPORT MODULE ========

module.exports = router;

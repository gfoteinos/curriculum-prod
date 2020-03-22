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

// ======== Upload Images ========

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

// ======== Load User Model ========

require("../models/User");
require("../models/Course");
require("../models/Module");
const User = mongoose.model("users");
const Course = mongoose.model("courses");
const Module = mongoose.model("modules");

// ======== Routes ========

// Load faculty member dashboard
router.get("/facultyMember", (req, res) => {
  // Create a faculty member object
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

  // Find All Course's
  Course.aggregate([
    { $project: { _id: 1, name: 1, degree: 1, color: 1, description: 1 } }
  ]).then(courses => {
    let selectCourseName = []; // For "Course Name" select tag in "Create Module" form
    let listCourses = []; // For "Courses" table in "Courses" form
    if (courses) {
      // Fill in bellow tables to pass them later in the view
      let counter = 1;
      courses.forEach(course => {
        selectCourseName.push({ name: course.name + "-" + course.degree });
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
    // console.log('courses: ' + JSON.stringify(courses));
    // console.log('listCourses: ' + JSON.stringify(listCourses));
    // Find another collection
    User.find({}).then(users => {
      // console.log('selectCourseName ' + JSON.stringify(selectCourseName));
      // console.log(faculty);
      // console.log(courses);
      // console.log(users);
      // Pass the faculty member object & fetched collection's data to the view
      // Pass data sets to the view
      res.render("dashboards/facultyMember", {
        faculty,
        selectCourseName,
        listCourses
      });
    });
  });

  // Course.find({}, { name: 1, _id: 0 }).then(courses => {
  //   // Create a faculty member object
  //   const faculty = {
  //     id: req.user.id,
  //     name: req.user.name,
  //     academicRank: req.user.academicRank,
  //     email: req.user.email,
  //     phone: req.user.phone,
  //     officeNumber: req.user.officeNumber,
  //     photo: req.user.photo,
  //     bio: req.user.bio,
  //     facebook: req.user.facebook,
  //     twitter: req.user.twitter,
  //     linkedin: req.user.linkedin
  //   };
  //   // Pass the faculty member object to the view
  //   res.render("dashboards/facultyMember", {
  //     faculty,
  //     courses
  //   });
  // });
});

// Load student dashboard
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

// Update email
router.put("/facultyMember/email/:id", (req, res) => {
  // Check if the input email has already registered to another account
  User.findOne({ email: req.body.email }).then(user => {
    // If true trigger an error message and stop
    if (user) {
      req.flash(
        "error_msg",
        "Email has already registered. Please enter a another email."
      );
      res.redirect("/dashboards/facultyMember");
    } else {
      // Find the user via id
      User.findOne({ _id: req.params.id }).then(user => {
        if (user) {
          // Update the email with the new one
          user.email = req.body.email;
          user.save().then(user => {
            req.flash("success_msg", "Email has been updated");
            res.redirect("/dashboards/facultyMember");
          });
        }
      });
    }
  });
});

// Update password
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
            '"New password" and "Re-type new password" does not match'
          );
          res.redirect("/dashboards/facultyMember");
        } else {
          // If new password is less than 6 characters
          if (req.body.password1.length < 4) {
            req.flash("error_msg", "Password must be at least 6 characters");
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
                    req.flash("success_msg", "Password has been updated");
                    res.redirect("/dashboards/facultyMember");
                  });
              });
            });
          }
        }
      } else {
        // Trigger error message and reload the page
        req.flash("error_msg", "Current password does not match");
        res.redirect("/dashboards/facultyMember");
      }
    });
  });
});

// Update profile
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
        // In case of uploding a profile photo
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
            req.flash("success_msg", "Profile updated.");
            res.redirect("/dashboards/facultyMember");
          })
          // Catch any errors
          .catch(err => {
            console.log(err);
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
  console.log(`bodyName: ${bodyName}`);

  var error = "";
  // ======== Error Handling ========
  // ---- Form fields errors ----
  // Required form fields empty
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
    // ---- Course already exist ----
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
        req.flash("error_msg", err);
        res.redirect("/dashboards/facultyMember");
        return;
      });
  }
});

// Edit Course
router.put("/facultyMember/courses/:id", (req, res) => {
  Course.find({})
    .then(courses => {
      // ======== Error Handling ========
      // Initialize the error
      let error = "";

      // ---- Another Course With The Same "Name" & "Degree" Exist ----
      courses.forEach(course => {
        // Convert object_id to string
        const courseID = course._id.toString();
        if (
          courseID !== req.params.id &&
          course.name === req.body.name &&
          course.degree === req.body.degree
        ) {
          error = `Fail to update. There is another "Course" with the same "name" and "degree". Click the edit button again to retry.`;
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
          error = `Fail to update. The there are not any changes. Click the edit button again to retry.`;
        }
      });

      // In Case Of Errors Flash Error Message & Redirect Back To The Page
      if (error !== "") {
        req.flash("error_msg", error);
        res.redirect("/dashboards/facultyMember");
      } else {
        // ======== Update The "Course" Info ========
        Course.findOne({ _id: req.params.id })
          .then(course => {
            course.name = req.body.name;
            course.degree = req.body.degree;
            course.color = req.body.color;
            course.description = req.body.description;
            course.save().then(course => {
              req.flash("success_msg", "Course has been updated.");
              res.redirect("/dashboards/facultyMember");
            });
          })
          // Catch any errors
          .catch(err => {
            req.flash("error_msg", err);
            res.redirect("/dashboards/facultyMember");
            return;
          });
      }
    })
    // Catch any errors
    .catch(err => {
      req.flash("error_msg", err);
      res.redirect("/dashboards/facultyMember");
      return;
    });
});

// Create Module
router.post("/facultyMember/modules/", (req, res) => {
  // ======== Error Handling ========
  // ---- Form fields errors ----
  if (req.body.moduleName === "" || req.body.courseName === undefined) {
    error =
      '"Module Name" or "Course Name" are missing. Please fill in the form fields where missing.';
    req.flash("error_msg", error);
    res.redirect("/dashboards/facultyMember");
  } else {
    let courseNameDegree = req.body.courseName.split("-");
    const courseName = courseNameDegree[0];
    const courseDegree = courseNameDegree[1];
    // ---- Module already exist ----
    Module.findOne({
      $and: [
        { name: req.body.moduleName },
        { course: courseName },
        { degree: courseDegree }
      ]
    }).then(module => {
      if (module) {
        error = "Module already exist.";
        req.flash("error_msg", error);
        res.redirect("/dashboards/facultyMember");
      } else {
        // ======== Add data to the database ========
        // Find course's id to add as a course relation with the new module
        Course.find(
          { name: courseName, degree: courseDegree },
          { _id: 1 }
        ).then(courseID => {
          // ---- Prepare data for saving ----
          courseID = courseID[0]._id;
          const newModule = {
            name: req.body.moduleName,
            courseID: courseID,
            course: courseName,
            degree: courseDegree
          };
          // ---- Save data to the database ----
          new Module(newModule)
            // Save & Redirect with success message
            .save()
            .then(module => {
              req.flash("success_msg", "New module added.");
              res.redirect("/dashboards/facultyMember");
            });
        });
      }
    });
  }
});

// console.log(`db.id: ${typeof(courseID)} - req.param.id: ${typeof(req.params.id)}, db.name: ${typeof(course.name)} - req.body.name: ${typeof(req.body.name)}, db.degree: ${typeof(course.name)} - req.body.degree: ${typeof(req.body.degree)}`);

// ======== Export module ========

module.exports = router;

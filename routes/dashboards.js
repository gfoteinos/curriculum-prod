/* ========================
 * IMPORT REQUIRED MODULES
 * ======================== */
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

/* ========================
 * UPLOAD IMAGES
 * ======================== */
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

/* ========================
 * LOAD MODELS
 * ======================== */
require("../models/User");
require("../models/FacultyMember");
require("../models/Course");
require("../models/Module");
const User = mongoose.model("users");
const FacultyMember = mongoose.model("facultyMembers");
const Course = mongoose.model("courses");
const Module = mongoose.model("modules");

/* ========================
 * ROUTES
 * ======================== */
// Load "Faculty Member" Dashboard

// router.get("/facultyMember", (req, res, next) => {
//   // -------- Create A "Faculty Member" Object --------
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

//   // -------- Get All "Courses" --------
//   Course.find({})
//     .sort({ name: "asc" })
//     .then(courses => {
//       let listCourses = []; // For "Courses" table in "Courses" form
//       if (courses) {
//         // Fill in "Courses" table to pass it later in the view
//         let counter = 1;
//         courses.forEach(course => {
//           listCourses.push({
//             aa: counter,
//             id: course._id,
//             name: course.name,
//             degree: course.degree,
//             color: course.color,
//             description: course.description
//           });
//           counter++;
//         });
//       }

//       // -------- Get All "Modules" --------
//       Module.find({})
//         .populate("courseID")
//         .sort({ name: "asc" })
//         .then(modules => {
//           let listModules = []; // For "Modules" table in "Modules" form
//           if (modules) {
//             // Fill in "Modules" table to pass it later in the view
//             let counter = 1;
//             modules.forEach(module => {
//               listModules.push({
//                 aa: counter,
//                 id: module._id,
//                 name: module.name,
//                 course: module.courseID.name,
//                 degree: module.courseID.degree,
//                 color: module.color,
//                 description: module.description
//               });
//               counter++;
//             });
//           }

//           // -------- Get All "Taught Modules" --------
//           FacultyMember.findOne({ userID: req.user.id })
//             .populate("taughtModules")
//             .then(facultyMember => {
//               let taughtModulesList = []; // For "Taught Modules" table in "Dashboard - 'Modules List'" tab
//               if (facultyMember) {
//                 // Fill in "Taught Modules" table to pass it later in the view
//                 let counter = 1;
//                 modules = facultyMember.taughtModules;
//                 modules.forEach(module => {
//                   // Convert to String
//                   moduleCourseID = module.courseID;
//                   moduleCourseID = moduleCourseID.toString();

//                   listCourses.forEach(course => {
//                     // Convert to String
//                     courseID = course.id;
//                     courseID = courseID.toString();

//                     // Connect module with course
//                     if (courseID === moduleCourseID) {
//                       /*
//                        * If "courseID" in "modules" collection is muching with
//                        * the "_id" of "Courses" collection then build a "taught
//                        * module" row
//                        */
//                       taughtModulesList.push({
//                         aa: counter,
//                         name: module.name,
//                         courseName: course.name,
//                         courseDegree: course.degree
//                       });
//                       counter++;
//                     }
//                   });
//                 });
//               }
//               // -------- Pass Data Sets To The View --------
//               res.render("dashboards/facultyMember", {
//                 faculty,
//                 listCourses,
//                 listModules,
//                 taughtModulesList
//               });
//             });
//         });
//     });
// });

// ======== LOAD "FACULTY MEMBER" DASHBOARD ========
// Create A "Faculty Member" Object
router.get("/facultyMember", (req, res, next) => {
  FacultyMember.findOne({ userID: req.user.id })
    .then(member => {
      if (member) {
        // -------- Create A "Faculty Member" Object --------
        const faculty = {
          id: req.user.id,
          name: req.user.name,
          academicRank: member.academicRank,
          email: req.user.email,
          phone: req.user.phone,
          officeNumber: member.officeNumber,
          photo: req.user.photo,
          bio: req.user.bio,
          facebook: req.user.facebook,
          twitter: req.user.twitter,
          linkedin: req.user.linkedin
        };
        req.faculty = faculty;
        next();
      }
    })
    .catch(err => {
      console.log(err.message);
      return;
    });
});

// Create A List Of All "Courses"
router.get("/facultyMember", (req, res, next) => {
  // -------- Get All "Courses" --------
  Course.find({})
    .sort({ name: "asc" })
    .then(courses => {
      // -------- Create A "Courses" List --------
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
      req.listCourses = listCourses;
      next();
    })
    .catch(err => {
      console.log(err.message);
      return;
    });
});

// Create A List Of All "Modules"
router.get("/facultyMember", (req, res, next) => {
  // -------- Get All "Modules" --------
  Module.find({})
    .populate("courseID")
    .sort({ name: "asc" })
    .then(modules => {
      // -------- Create A "Modules" List --------
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
      req.listModules = listModules;
      next();
    })
    .catch(err => {
      console.log(err.message);
      return;
    });
});

// Create A List Of "Taught Modules"
router.get("/facultyMember", (req, res, next) => {
  // -------- Get All "Taught Modules" --------
  FacultyMember.findOne({ userID: req.user.id })
    .populate("taughtModules.moduleID")
    .then(facultyMember => {
      // -------- Create A "Taught Modules" List --------
      let listTaughtModules = []; // For "Taught Modules" table in "Dashboard - 'Modules List'" tab
      if (facultyMember) {
        // Fill in "Taught Modules" table to pass it later in the view
        let counter = 1;
        taughtModules = facultyMember.taughtModules;
        taughtModules.forEach(taughtModule => {
          // Convert to String
          moduleCourseID = taughtModule.moduleID.courseID;
          moduleCourseID = moduleCourseID.toString();

          req.listCourses.forEach(course => {
            // Convert to String
            courseID = course.id;
            courseID = courseID.toString();

            // Connect module with course
            if (courseID === moduleCourseID) {
              /*
               * If "courseID" in "modules" collection is maching with
               * the "_id" of "Courses" collection then build a "taught
               * module" row
               */

              if (taughtModule.coursework.date) {
                // Convert date value to English UK short format
                const options = {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric"
                };
                tempDate = new Date(
                  taughtModule.coursework.date
                ).toLocaleString("en-GB", options);
                tempDate = tempDate.split("/");
                dateUKFormat = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;
              } else {
                dateUKFormat = "";
              }

              listTaughtModules.push({
                aa: counter,
                taughtModuleID: taughtModule._id.toString(),
                moduleID: taughtModule.moduleID.id,
                moduleName: taughtModule.moduleID.name,
                courseworkDate: dateUKFormat,
                courseName: course.name,
                courseDegree: course.degree
              });
              counter++;
            }
          });
        });
      }
      req.listTaughtModules = listTaughtModules;
      next();
    });
});

// Pass Data Sets To The View
router.get("/facultyMember", (req, res, next) => {
  // Prepare the data to be send
  const faculty = req.faculty;
  const listCourses = req.listCourses;
  const listModules = req.listModules;
  const listTaughtModules = req.listTaughtModules;

  // Pass the data to the view
  res.render("dashboards/facultyMember", {
    faculty,
    listCourses,
    listModules,
    listTaughtModules
  });
});

// ======== LOAD "STUDENT" DASHBOARD ========
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

// ======== ACCOUNT INFO FORM ========
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

// ======== PROFILE FORM ========
// Update Profile
router.put("/facultyMember/profile/:id", (req, res) => {
  upload(req, res, function(err) {
    let error = "";

    // ---- Handle Uploading Photo Errors ----
    if (err instanceof multer.MulterError) {
      error = `Error uploading photo: ${err.message}`;
    } else if (err) {
      error = err; // Error: Only image files are allowed to upload
      //see: "---- Init Upload ----" at "==== Upload Images ====" section
    }

    // ---- Handle Form Fields Errors ----
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

    if (error != "") {
      // ---- If error flash error message & redirect back to the page ----
      req.flash("error_msg", error);
      res.redirect("/dashboards/facultyMember");
    } else {
      // ---- Update The Database Collections ----
      // Update the "users" collection
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
        user.phone = req.body.phone;
        user.photo = photo;
        // Bio
        user.bio = req.body.bio;
        // Social
        user.facebook = req.body.facebook;
        user.twitter = req.body.twitter;
        user.linkedin = req.body.linkedin;

        // Save to the database
        user.save().catch(err => {
          // Catch any errors
          console.log(err.message);
          // req.flash("error_msg", err.message);
          // res.redirect("/dashboards/facultyMember");
          return;
        });
      });

      // Update the "facultymembers" collection
      FacultyMember.findOne({ userID: req.params.id }).then(member => {
        // ---- Update the faculty member's profile info ----
        member.academicRank = req.body.academicRank;
        member.officeNumber = req.body.officeNumber;
        // Save to the database
        member.save().catch(err => {
          // Catch any errors
          console.log(err.message);
          // req.flash("error_msg", err.message);
          // res.redirect("/dashboards/facultyMember");
          return;
        });
      });

      // ---- Flash Success Message & Redirect Back To The Page ----
      req.flash("success_msg", "Profile has been updated.");
      res.redirect("/dashboards/facultyMember");
    }
  });
});

// ======== COURSES FORM ========
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
  let ids = req.body.coursesID;

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

// ======== MODULES FORM ========
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
  let ids = req.body.modulesID;

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

// ======== DASHBOARD FORM ========
// Update "facultymember" collection - Add Taught Modules
router.post("/facultyMember/taughtModules/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        const moduleIDsToAdd = req.body.modulesID;
        // If the faculty member exist add "taught modules"
        if (typeof moduleIDsToAdd === "string") {
          const taughtModule = {
            moduleID: moduleIDsToAdd
          };
          member.taughtModules.push(taughtModule);
        } else {
          moduleIDsToAdd.forEach(id => {
            const taughtModule = {
              moduleID: id
            };
            member.taughtModules.push(taughtModule);
          });
        }
      }

      // Save to the database
      member
        .save()
        .then(member => {
          req.flash(
            "success_msg",
            "Taught Modules have been added successfully."
          );
          res.redirect("/dashboards/facultyMember");
        })
        .catch(err => {
          // Catch any errors
          console.log(err.message);
          return;
        });
    });
});

// Update "facultymember" collection - Delete Taught Modules
router.delete("/facultyMember/taughtModules/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        const moduleIDsToDelete = req.body.modulesID;
        // If the faculty member exist delete taught modules
        if (typeof moduleIDsToDelete === "string") {
          member.taughtModules.forEach((taughtModule, index) => {
            if (taughtModule.moduleID.id === moduleIDsToDelete) {
              // member.taughtModules.splice(index, 1);
              const id = taughtModule._id.toString();
              taughtModule.remove({ _id: id });
            }
          });
        } else {
          // const moduleIDsToDelete = req.body.modulesID;
          moduleIDsToDelete.forEach(id => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule.moduleID.id === id) {
                // member.taughtModules.splice(index, 1);
                const id = taughtModule._id.toString();
                taughtModule.remove({ _id: id });
              }
            });
          });
        }
      }

      // Save to the database
      member
        .save()
        .then(member => {
          req.flash(
            "success_msg",
            "Taught Modules have been deleted successfully."
          );
          res.redirect("/dashboards/facultyMember");
        })
        .catch(err => {
          // Catch any errors
          console.log(err.message);
          return;
        });
    });
});

// Update "facultymember collection" - Add Courseworks
router.post("/facultyMember/courseworks/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        // If the faculty member exist add "coursework" in a taught module
        const taughtModulesToAddCourseworksIDs = req.body.modulesID;
        let dateText;
        req.body.date.forEach(item => {
          if (item !== "") {
            dateText = item;
          }
        });
        if (typeof taughtModulesToAddCourseworksIDs === "string") {
          // In case of adding one coursework
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule.moduleID.id === taughtModulesToAddCourseworksIDs) {
              const newCoursework = {
                date: dateText
              };
              taughtModule.coursework = newCoursework;
            }
          });
        } else {
          // In case of adding many courseworks
          taughtModulesToAddCourseworksIDs.forEach((id, index) => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule.moduleID.id === id) {
                const newCoursework = {
                  date: req.body.date[index]
                };
                taughtModule.coursework = newCoursework;
              }
            });
          });
        }
      }

      // Save to the database
      member
        .save()
        .then(member => {
          req.flash("success_msg", "Courseworks have been added successfully.");
          res.redirect("/dashboards/facultyMember");
        })
        .catch(err => {
          // Catch any errors
          console.log(err.message);
          return;
        });
    });
});

// console.log(`db.id: ${typeof(courseID)} - req.param.id: ${typeof(req.params.id)}, db.name: ${typeof(course.name)} - req.body.name: ${typeof(req.body.name)}, db.degree: ${typeof(course.name)} - req.body.degree: ${typeof(req.body.degree)}`);

/* ========================
 * EXPORT MODULE
 * ======================== */
module.exports = router;

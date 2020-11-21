/* ========================
 * IMPORT REQUIRED MODULES
 * ======================== */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// const passport = require('passport');
const router = express.Router();
const multer = require("multer"); // Used for uploading files
const { reverse } = require("dns");

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
        // console.log(req.user);
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
        let courseworksCounter = 1;
        let examsCounter = 1;
        taughtModules = facultyMember.taughtModules;
        // Object.keys(taughtModules);
        taughtModules.forEach(taughtModule => {
          // Convert to String
          if (taughtModule.moduleID !== null) {
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

                let courseworkDateUKFormat;
                if (taughtModule.coursework.date) {
                  // Convert date value to English UK short format
                  const options = {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric"
                  };
                  let tempDate = new Date(
                    taughtModule.coursework.date
                  ).toLocaleString("en-GB", options);
                  tempDate = tempDate.split("/");
                  tempDate.forEach((item, index) => {
                    if (item.length === 1) {
                      item = `0${item}`;
                      tempDate[index] = item;
                    }
                  });
                  courseworkDateUKFormat = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;
                } else {
                  courseworkDateUKFormat = "";
                }

                let examDateUKFormat;
                let examTime;
                if (taughtModule.exam.date) {
                  // Convert date value to English UK short format
                  const options = {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric"
                  };
                  let tempDate = new Date(
                    taughtModule.exam.date
                  ).toLocaleString("en-GB", options);
                  tempDate = tempDate.split("/");
                  tempDate.forEach((item, index) => {
                    if (item.length === 1) {
                      item = `0${item}`;
                      tempDate[index] = item;
                    }
                  });
                  examDateUKFormat = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;
                  let tempTime = new Date(taughtModule.exam.date);
                  examTime = `${tempTime.getHours()}:${tempTime.getMinutes()}`;
                } else {
                  examDateUKFormat = "";
                  examTime = "";
                }

                listTaughtModules.push({
                  aa: counter,
                  taughtModuleID: taughtModule._id.toString(),
                  moduleID: taughtModule.moduleID.id,
                  moduleName: taughtModule.moduleID.name,
                  courseworksAA: courseworksCounter,
                  courseworkDate: courseworkDateUKFormat,
                  courseName: course.name,
                  courseDegree: course.degree,
                  examsAA: examsCounter,
                  examDate: examDateUKFormat,
                  examTime: examTime,
                  examClassroom: taughtModule.exam.classroom
                });
                counter++;
                if (courseworkDateUKFormat) {
                  courseworksCounter++;
                }
                if (examDateUKFormat) {
                  examsCounter++;
                }
              }
            });
          }
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
  // Get the selected course ids
  let coursesIdsToDelete = req.body.coursesID;

  /* In case of only one "course" is selected to delete, the "id" is a string.
   *  In order to delete the "course" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof coursesIdsToDelete === "string") {
    let idArray = [];
    idArray.push(coursesIdsToDelete);
    coursesIdsToDelete = idArray;
  }

  /**
   * Remove "taught modules" which are related to deleted courses
   * from every "faculty member"
   */
  FacultyMember.find({})
    .populate("taughtModules.moduleID")
    .then(members => {
      if (members) {
        members.forEach(member => {
          if (member) {
            coursesIdsToDelete.forEach(id => {
              /**
               * Because the array is being re-indexed when a "taught module" is
               * removed as a result it let one item and not removed all of
               * them. A solution is to iterate in reverse.
               */
              for (let i = member.taughtModules.length - 1; i >= 0; i--) {
                let courseID = member.taughtModules[i].moduleID.courseID;
                courseID = courseID.toString();
                if (courseID === id) {
                  member.taughtModules[i].remove();
                }
              }
            });
            // Save changes in Database
            member.save().catch(err => {
              // Catch any errors
              console.log(err.message);
              return;
            });
          }
        });
      }
    })
    /**
     * Delete Modules Which Are Related To Deleted Courses
     * From The Database
     */
    .then(() => {
      Module.find({}).then(modules => {
        if (modules) {
          modules.forEach(module => {
            coursesIdsToDelete.forEach(id => {
              if (module.courseID.toString() === id) {
                Module.deleteOne({ _id: module.id })
                  // Catch any errors
                  .catch(err => {
                    req.flash("error_msg", err.message);
                    res.redirect("/dashboards/facultyMember");
                    return;
                  });
              }
            });
          });
        }
      });
    })
    // ==== Delete Courses from Database ====
    .then(() => {
      Course.find().then(courses => {
        if (courses) {
          courses.forEach(course => {
            coursesIdsToDelete.forEach(id => {
              if (course.id === id) {
                Course.deleteOne({ _id: id })
                  // Catch any errors
                  .catch(err => {
                    req.flash("error_msg", err.message);
                    res.redirect("/dashboards/facultyMember");
                    return;
                  });
              }
            });
          });
        }
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
  let modulesIdsToDelete = req.body.modulesID;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof modulesIdsToDelete === "string") {
    let idArray = [];
    idArray.push(modulesIdsToDelete);
    modulesIdsToDelete = idArray;
  }

  FacultyMember.find({})
    .populate("taughtModules.moduleID")
    .then(members => {
      if (members) {
        // ==== Remove "Taught Module" Form Every "Faculty Member" ====
        members.forEach(member => {
          modulesIdsToDelete.forEach(id => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule.moduleID.id === id) {
                taughtModule.remove();
              }
            });
          });
          // Save changes in Database
          member.save().catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
        });
      }
      // ==== Delete Modules From The Database ====
      modulesIdsToDelete.forEach(id => {
        Module.deleteOne({ _id: id })
          // Catch any errors
          .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect("/dashboards/facultyMember");
            return;
          });
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
        // -------- If The Faculty Member Exist Delete Taught Modules --------
        const moduleIDsToDelete = req.body.modulesID;
        // ---- In case of delete one "taught module" ----
        if (typeof moduleIDsToDelete === "string") {
          member.taughtModules.forEach((taughtModule, index) => {
            if (taughtModule.moduleID.id === moduleIDsToDelete) {
              // member.taughtModules.splice(index, 1);
              const id = taughtModule._id.toString(); //Bug-todelete?
              // taughtModule.remove({ _id: id });
              taughtModule.remove();
            }
          });
        } else {
          // ---- In case of delete many "taught modules" ----
          // const moduleIDsToDelete = req.body.modulesID;
          moduleIDsToDelete.forEach(id => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule.moduleID.id === id) {
                // member.taughtModules.splice(index, 1);
                const id = taughtModule._id.toString(); //Bug-to delete?
                // taughtModule.remove({ _id: id });
                taughtModule.remove();
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
      let addCourseworks = false;
      if (member) {
        // ---- If The Faculty Member Exist ----
        // Get the data from UI form
        let uiTaughtModulesIDs = [];
        if (typeof req.body.taughtModuleID === "string") {
          // If there is only 1 taught module
          uiTaughtModulesIDs.push(req.body.taughtModuleID);
        } else {
          uiTaughtModulesIDs = req.body.taughtModuleID;
        }
        const uiDates = req.body.date;

        // Add courseworks to the database
        member.taughtModules.forEach(taughtModule => {
          uiTaughtModulesIDs.forEach((uiTaughtModuleID, index) => {
            if (
              taughtModule._id.toString() === uiTaughtModuleID &&
              uiDates[index] !== ""
            ) {
              const newCoursework = {
                date: uiDates[index]
              };
              taughtModule.coursework = newCoursework;
              addCourseworks = true;
            }
          });
        });
      }

      if (addCourseworks) {
        // Save to the database
        member
          .save()
          .then(member => {
            req.flash(
              "success_msg",
              "Courseworks have been added successfully."
            );
            res.redirect("/dashboards/facultyMember");
          })
          .catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
      } else {
        req.flash("error_msg", "It was not selected any coursework to add.");
        res.redirect("/dashboards/facultyMember");
      }
    });
});

// Update "facultymember collection" - Update Courseworks
router.put("/facultyMember/courseworks/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let addCourseworks = false;
      if (member) {
        // ---- Get the data from UI form ----
        const uiTaughtModuleID = req.body.uiTaughtModuleID;
        const uiCourseworkDate = req.body.uiCourseworkDate;

        member.taughtModules.forEach(taughtModule => {
          if (
            taughtModule._id.toString() === uiTaughtModuleID &&
            uiCourseworkDate !== ""
          ) {
            // ---- Update Data ----
            const newCoursework = {
              date: uiCourseworkDate
            };
            taughtModule.coursework = newCoursework;
            addCourseworks = true;
          }
        });
      }

      if (addCourseworks) {
        // Save to the database
        member
          .save()
          .then(member => {
            res.json({
              type: "success",
              message: "Courseworks have been updated successfully."
            });
          })
          .catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
      }
    });
});

// Update "facultymember" collection - Delete Courseworks
router.delete("/facultyMember/courseworks/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        // -------- If The Faculty Member Exist Delete Courseworks --------
        const uiTaughtModuleIDs = req.body.taughtModulesID;
        // ---- In case of delete one "coursework" ----
        if (typeof uiTaughtModuleIDs === "string") {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule._id.toString() === uiTaughtModuleIDs) {
              taughtModule.coursework = undefined;
            }
          });
        } else {
          // ---- In case of delete many "courseworks" ----
          uiTaughtModuleIDs.forEach(uiID => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule._id.toString() === uiID) {
                taughtModule.coursework = undefined;
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
            "Courseworks have been deleted successfully."
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

// Update "facultymember collection" - Add Exams
router.post("/facultyMember/exams/:id", (req, res) => {
  // res.send("Add Exams");
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let addExams = false;
      if (member) {
        // ---- If The Faculty Member Exist ----
        // Get the data from UI form
        let uiTaughtModulesIDs = [];
        let uiDates = [];
        let uiTimes = [];
        let uiClassrooms = [];
        if (typeof req.body.taughtModuleID === "string") {
          // If there is only 1 taught module
          uiTaughtModulesIDs.push(req.body.taughtModuleID);
          uiDates.push(req.body.date);
          uiTimes.push(req.body.time);
          uiClassrooms.push(req.body.classroom);
        } else {
          uiTaughtModulesIDs = req.body.taughtModuleID;
          uiDates = req.body.date;
          uiTimes = req.body.time;
          uiClassrooms = req.body.classroom;
        }

        // Add exams to the database
        member.taughtModules.forEach(taughtModule => {
          uiTaughtModulesIDs.forEach((uiTaughtModuleID, index) => {
            if (
              taughtModule._id.toString() === uiTaughtModuleID &&
              uiDates[index] !== "" &&
              uiTimes[index] !== "" &&
              uiClassrooms[index] !== ""
            ) {
              let uiDate = new Date(uiDates[index]);
              let uiTime = uiTimes[index].split(":");
              uiDate.setHours(uiTime[0], uiTime[1], 0);
              const newExam = {
                date: uiDate,
                classroom: uiClassrooms[index]
              };
              taughtModule.exam = newExam;
              addExams = true;
            }
          });
        });
      }

      if (addExams) {
        // Save to the database
        member
          .save()
          .then(member => {
            req.flash("success_msg", "Exams have been added successfully.");
            res.redirect("/dashboards/facultyMember");
          })
          .catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
      } else {
        req.flash("error_msg", "It was not selected any exam to add.");
        res.redirect("/dashboards/facultyMember");
      }
    });
});

// Update "facultymember" collection - Delete Exams
router.delete("/facultyMember/exams/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let deleteExams = false;
      if (member) {
        // -------- If The Faculty Member Exist --------
        // Get "taught module" ids
        let uiTaughtModuleIDs = req.body.taughtModulesID;

        if (typeof uiTaughtModuleIDs === "string") {
          //  In case of one exam selected convert to array
          let idArray = [];
          idArray.push(uiTaughtModuleIDs);
          uiTaughtModuleIDs = idArray;
        }

        // ---- Delete exams ----
        uiTaughtModuleIDs.forEach(uiID => {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule._id.toString() === uiID) {
              taughtModule.exam = undefined;
              deleteExams = true;
            }
          });
        });
      }

      if (deleteExams) {
        // Save to the database
        member
          .save()
          .then(member => {
            req.flash("success_msg", "Exams have been deleted successfully.");
            res.redirect("/dashboards/facultyMember");
          })
          .catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
      }
    });
});

// console.log(`db.id: ${typeof(courseID)} - req.param.id: ${typeof(req.params.id)}, db.name: ${typeof(course.name)} - req.body.name: ${typeof(req.body.name)}, db.degree: ${typeof(course.name)} - req.body.degree: ${typeof(req.body.degree)}`);

/* ========================
 * EXPORT MODULE
 * ======================== */
module.exports = router;

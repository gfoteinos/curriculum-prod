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

/* ================================================
 * UPLOAD IMAGES
 * ================================================ */
/**
 * On that version the "multer" works perfect for uploading images to heroku
 */

// ---- Set Storage Engine ----
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, './public/img/facultyMembers')
    cb(null, path.join(__dirname, "../public", "img", "users"));
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

/* ================================================
 * LOAD MODELS
 * ================================================ */
require("../models/User");
require("../models/FacultyMember");
require("../models/Student");
require("../models/Course");
require("../models/Module");
const User = mongoose.model("users");
const FacultyMember = mongoose.model("facultyMembers");
const Student = mongoose.model("students");
const Course = mongoose.model("courses");
const Module = mongoose.model("modules");

/* ================================================
 * ROUTES
 * ================================================ */

/* ------------------------------------------------
 * FUNCTIONS - MIDDLEWARES
 * ------------------------------------------------ */
// const addStudentInTaughtModules = (studentID) => {
//   console.log(`StudentID ${studentID}`);
// };

const getModules = (req, res, next) => {
  // -------- Get All "Modules" --------
  Module.find({})
    .populate("courseID")
    .sort({ name: "asc" })
    .then(modules => {
      // -------- Create A "Modules" List --------
      let listModules = [];
      if (modules) {
        // Fill in "Module" list
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
};

const getTaughtModules = (req, res, next) => {
  FacultyMember.find({})
    .populate("taughtModules.moduleID")
    .populate("userID")
    .then(facultyMembers => {
      // ==== Fills In A Table Of "Taught Modules" && "Faculty Member" ====
      let taughtModules = [];
      if (facultyMembers) {
        let taughtModuleCounter = 1;
        facultyMembers.forEach(member => {
          member.taughtModules.forEach(taughtModule => {
            taughtModules.push({
              aa: taughtModuleCounter,
              taughtModuleID: taughtModule.id,
              moduleName: taughtModule.moduleID.name,
              facultyName: member.userID.name,
              courseworkDate: taughtModule.coursework.date,
              examDate: taughtModule.exam.date,
              examClass: taughtModule.exam.classroom
            });
            taughtModuleCounter++;
          });
        });
      }

      // Clear undefined values form courseworks & exams
      taughtModules.forEach(module => {
        if (module.courseworkDate === undefined) {
          delete module.courseworkDate;
        }
        if (module.examDate === undefined) {
          delete module.examDate;
          delete module.examClass;
        }
      });
      req.taughtModules = taughtModules;
      next();
    })
    .catch(err => {
      console.log(err.message);
      return;
    });
};

const getStudentOverview = (req, res, next) => {
  Student.findOne({ userID: req.user.id })
    .then(student => {
      // Initialize variables
      let studentModules = [];
      let courseworks = [];
      let exams = [];
      let grades = [];
      let passModulesCounter = 0;
      let failModulesCounter = 0;
      let ongoingModulesCounter = 0;
      let progress = {};

      if (student) {
        let courseworkCounter = 1;
        let examCounter = 1;
        let gradesCounter = 1;
        student.taughtModules.forEach(module => {
          /* FILL IN THE DATA TO VIEW IN UI
           * ----------------------------------------------- */
          req.taughtModules.forEach(taughtModule => {
            let moduleID = module.taughtModuleID.toString();
            if (moduleID === taughtModule.taughtModuleID) {
              // Fill in the "studentModules" table
              studentModules.push(taughtModule);

              // Fill in the "grades" table
              if (module.mark === undefined) {
                module.mark = "on going";
              }
              grades.push({
                aa: gradesCounter,
                moduleName: taughtModule.moduleName,
                facultyName: taughtModule.facultyName,
                mark: module.mark
              });
              gradesCounter++;

              // Fill in the "courseworks" table
              if (taughtModule.courseworkDate !== undefined) {
                courseworks.push({
                  aa: courseworkCounter,
                  moduleName: taughtModule.moduleName,
                  courseworkDate: taughtModule.courseworkDate
                });
                courseworkCounter++;
              }

              // Fill in the "exams" table
              if (taughtModule.examDate !== undefined) {
                exams.push({
                  aa: examCounter,
                  moduleName: taughtModule.moduleName,
                  examDate: taughtModule.examDate,
                  examClass: taughtModule.examClass
                });
                examCounter++;
              }
            }
          });

          /* CALCULATE THE PROGRESS VARIABLES
           * ----------------------------------------------- */
          let mark = module.mark;
          mark = parseInt(mark);
          if (mark >= 50) {
            passModulesCounter += 1;
          } else if (mark < 50) {
            failModulesCounter += 1;
          } else {
            ongoingModulesCounter += 1;
          }
        });

        /* CONVERT DATE VALUES TO ENGLISH UK SHORT FORMAT
         * ----------------------------------------------- */
        courseworks.forEach(coursework => {
          if (coursework) {
            const options = {
              day: "numeric",
              month: "numeric",
              year: "numeric"
            };
            let tempDate = new Date(coursework.courseworkDate).toLocaleString(
              "en-GB",
              options
            );
            tempDate = tempDate.split("/");
            tempDate.forEach((item, index) => {
              if (item.length === 1) {
                item = `0${item}`;
                tempDate[index] = item;
              }
            });
            courseworkDateUKFormat = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;
            coursework.courseworkDate = courseworkDateUKFormat;
          }
        });
        exams.forEach(exam => {
          if (exam) {
            // Convert date value to English UK short format
            const options = {
              day: "numeric",
              month: "numeric",
              year: "numeric"
            };
            let tempDate = new Date(exam.examDate).toLocaleString(
              "en-GB",
              options
            );
            tempDate = tempDate.split("/");
            tempDate.forEach((item, index) => {
              if (item.length === 1) {
                item = `0${item}`;
                tempDate[index] = item;
              }
            });
            examDateUKFormat = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;
            exam.examDate = examDateUKFormat;
          }
        });

        /* REARRANGE THE TABLE
         * ----------------------------------------------- */
        studentModules.forEach((module, index) => {
          module.aa = index + 1;
        });

        /* FILL IN THE PROGRESS OBJECT
         * ----------------------------------------------- */
        const modulesNumber =
          passModulesCounter + failModulesCounter + ongoingModulesCounter;
        passWidth = (passModulesCounter / modulesNumber) * 100;
        failWidth = (failModulesCounter / modulesNumber) * 100;
        ongoingWidth = (ongoingModulesCounter / modulesNumber) * 100;
        progress = {
          total: modulesNumber,
          pass: passModulesCounter,
          passWidth: passWidth,
          fail: failModulesCounter,
          failWidth: failWidth,
          ongoing: ongoingModulesCounter,
          ongoingWidth: ongoingWidth
        };
      }

      /* RETURN THE DATA
       * ----------------------------------------------- */
      req.progress = progress;
      req.studentModules = studentModules;
      req.studentCourseworks = courseworks;
      req.studentExams = exams;
      req.studentGrades = grades;
      next();
    })
    .catch(err => {
      console.log(`On function 'getStudentOverview': ${err.message}`);
      return;
    });
};

/* ------------------------------------------------
 * LOAD "FACULTY MEMBER" DASHBOARD
 * ------------------------------------------------ */
// ---------------- Create A "Faculty Member" Object ----------------
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

// ---------------- Create A List Of All "Courses" ----------------
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

// ---------------- Create A List Of All "Modules" ----------------
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

// ---------------- Create A List Of "Taught Modules" ----------------
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
                  /**
                   * Convert time to 2 digits (01) instead of 1 in case of
                   * 0-9 minutes
                   */
                  let hours = tempTime.getHours().toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                  });
                  let minutes = tempTime.getMinutes().toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                  });
                  /** --------------------------------------------------- */
                  examTime = `${hours}:${minutes}`;
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

// ---------------- Pass Data Sets To The View ----------------
router.get("/facultyMember", (req, res, next) => {
  // console.log(req.user);
  // Prepare the data to be send
  const faculty = req.faculty;
  const listCourses = req.listCourses;
  const listModules = req.listModules;
  const listTaughtModules = req.listTaughtModules;
  // console.log("Taught Modules:");
  // console.log(listTaughtModules);
  // console.log(faculty);

  // Pass the data to the view
  res.render("dashboards/facultyMember", {
    faculty,
    listCourses,
    listModules,
    listTaughtModules
  });
});

/* ------------------------------------------------
 * LOAD "STUDENT" DASHBOARD
 * ------------------------------------------------ */
// router.use(getModules);
router.use(getTaughtModules);
router.use(getStudentOverview);
router.get("/student", (req, res) => {
  /* CREATE A STUDENT OBJECT
   * ----------------------------------------------- */
  const student = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    photo: req.user.photo,
    bio: req.user.bio,
    facebook: req.user.facebook,
    twitter: req.user.twitter,
    linkedin: req.user.linkedin
  };

  /* PASS THE DATA TO THE VIEW
   * ----------------------------------------------- */
  const taughtModules = req.taughtModules;
  const studentSelectedModules = req.studentModules;
  const progress = req.progress;
  const studentCourseworks = req.studentCourseworks;
  const studentExams = req.studentExams;
  const studentGrades = req.studentGrades;
  res.render("dashboards/student", {
    student,
    taughtModules,
    studentSelectedModules,
    progress,
    studentCourseworks,
    studentExams,
    studentGrades
  });
});

/* ------------------------------------------------
 * FORM ACCOUNT INFO
 * ------------------------------------------------ */
// ---------------- Update Email ----------------
router.put("/facultyMember/email/:id", (req, res) => {
  // Check If The Input Email Has Already Registered To Another Account
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // ---- Flash Error Message & Redirect Back To The Page ----
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
            // ---- Flash Success Message & Redirect Back To The Page ----
            req.flash("success_msg", "Email has been updated.");
            res.redirect("/dashboards/facultyMember");
          });
        }
      });
    }
  });
});

router.put("/student/email/:id", (req, res) => {
  // Check If The Input Email Has Already Registered To Another Account
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // ---- Flash Error Message & Redirect Back To The Page ----
      req.flash(
        "error_msg",
        "Email has already registered. Please enter another email."
      );
      res.redirect("/dashboards/student");
    } else {
      // Find the user via id
      User.findOne({ _id: req.params.id }).then(user => {
        if (user) {
          // Update The Email With The New One
          user.email = req.body.email;
          user.save().then(user => {
            // ---- Flash Success Message & Redirect Back To The Page ----
            req.flash("success_msg", "Email has been updated.");
            res.redirect("/dashboards/student");
          });
        }
      });
    }
  });
});

// ---------------- Update Password ----------------
router.put("/facultyMember/password/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    // Compare UI password with the one in database
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;
      // ---- If Match Update Password Else Flash Error Message ----
      if (isMatch) {
        // ======== Password Validation ========
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
            // -------- Update The Password --------
            // Change password with the new one
            user.password = req.body.password1;
            // Encrypt The New Password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                // Save The New Password To The Database
                user
                  .save()
                  // Redirect To The "Faculty Member" Page
                  .then(user => {
                    req.flash("success_msg", "Password has been updated.");
                    res.redirect("/dashboards/facultyMember");
                  });
              });
            });
          }
        }
      } else {
        // Flash Error Message And Reload The Page
        req.flash("error_msg", "Current password does not match.");
        res.redirect("/dashboards/facultyMember");
      }
    });
  });
});

router.put("/student/password/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    // Compare UI password with the one in database
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;
      // ---- If Match Update Password Else Flash Error Message ----
      if (isMatch) {
        // ======== Password Validation ========
        // If "new password & re-type password" doesn't much
        if (req.body.password1 != req.body.password2) {
          req.flash(
            "error_msg",
            '"New password" and "Re-type new password" does not match.'
          );
          res.redirect("/dashboards/student");
        } else {
          // If new password is less than 6 characters
          if (req.body.password1.length < 4) {
            req.flash("error_msg", "Password must be at least 6 characters.");
            res.redirect("/dashboards/student");
          } else {
            // -------- Update The Password --------
            // Change password with the new one
            user.password = req.body.password1;
            // Encrypt The New Password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                // Save The New Password To The Database
                user
                  .save()
                  // Redirect To The "Student" Page
                  .then(user => {
                    req.flash("success_msg", "Password has been updated.");
                    res.redirect("/dashboards/student");
                  });
              });
            });
          }
        }
      } else {
        // Flash Error Message And Reload The Page
        req.flash("error_msg", "Current password does not match.");
        res.redirect("/dashboards/student");
      }
    });
  });
});

/* ------------------------------------------------
 * FORM PROFILE
 * ------------------------------------------------ */
// ---------------- Update Profile ----------------
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
      // ---- If Error Flash Error Message & Redirect Back To The Page ----
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
          // console.log(err.message);
          req.flash("error_msg", err.message);
          res.redirect("/dashboards/facultyMember");
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
          // console.log(err.message);
          req.flash("error_msg", err.message);
          res.redirect("/dashboards/facultyMember");
          return;
        });
      });

      // ---- Flash Success Message & Redirect Back To The Page ----
      req.flash("success_msg", "Profile has been updated.");
      res.redirect("/dashboards/facultyMember");
    }
  });
});

router.put("/student/profile/:id", (req, res) => {
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
      req.body.phone === "" ||
      req.body.bio === ""
    ) {
      error =
        'One or more of the fields "Full Name, Phone, Bio" are empty. Please fill in the fields where missing.';
    }

    if (error != "") {
      // ---- If Error Flash Error Message & Redirect Back To The Page ----
      req.flash("error_msg", error);
      res.redirect("/dashboards/students");
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
          // console.log(err.message);
          req.flash("error_msg", err.message);
          res.redirect("/dashboards/facultyMember");
          return;
        });
      });

      // // Update the "students" collection
      // FacultyMember.findOne({ userID: req.params.id }).then(member => {
      //   // ---- Update the faculty member's profile info ----
      //   member.academicRank = req.body.academicRank;
      //   member.officeNumber = req.body.officeNumber;
      //   // Save to the database
      //   member.save().catch(err => {
      //     // Catch any errors
      //     // console.log(err.message);
      //     req.flash("error_msg", err.message);
      //     res.redirect("/dashboards/facultyMember");
      //     return;
      //   });
      // });

      // ---- Flash Success Message & Redirect Back To The Page ----
      req.flash("success_msg", "Profile has been updated.");
      res.redirect("/dashboards/student");
    }
  });
});

/* ------------------------------------------------
 * FORM COURSES
 * ------------------------------------------------ */
// ---------------- Create Course ----------------
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

// ---------------- Edit Course ----------------
router.put("/facultyMember/courses/:id", (req, res) => {
  console.log(req.body.description);
  // Get all courses
  Course.find({})
    .then(courses => {
      // ======== ERROR HANDLING ========
      // Initialize the error
      let error = "";
      if (req.body.description === "") {
        error =
          "One or more of the form's fields are empty. Please fill in the form fields where missing.";
      }

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

// ---------------- Delete Course ----------------
router.delete("/facultyMember/courses/", (req, res) => {
  /* GATHER NECESSARY UI DATA
   * ----------------------------------------------- */
  let uiCourseIds = req.body.coursesID;

  /* PREPARE UI DATA FOR PROCESSING
   * ----------------------------------------------- */
  /* In case of only one "course" is selected to delete, the "id" is a string.
   * In order to delete the "course" it needs to be converted to an array of
   * one object.
   */
  // Convert To An Array Of One Object
  if (typeof uiCourseIds === "string") {
    let idArray = [];
    idArray.push(uiCourseIds);
    uiCourseIds = idArray;
  }

  /* REMOVE "TAUGHT MODULES" FROM "facultyMember" COLLECTION
   * --------------------------------------------------- */
  let facultyTaughtModuleIDs = [];
  FacultyMember.find({})
    .populate("taughtModules.moduleID")
    .then(members => {
      if (members) {
        members.forEach(member => {
          uiCourseIds.forEach(uiCourseID => {
            /**
             * Because the array is being re-indexed when a "taught module" is
             * removed as a result it let one item and not removed all of
             * them. A solution is to iterate in reverse.
             */
            for (let i = member.taughtModules.length - 1; i >= 0; i--) {
              const dbCourseID = member.taughtModules[i].moduleID.courseID;
              if (dbCourseID.toString() === uiCourseID) {
                facultyTaughtModuleIDs.push(member.taughtModules[i]._id);
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
        });
      }
      return facultyTaughtModuleIDs;
    })
    /* REMOVE "TAUGHT MODULES" FROM "students" COLLECTION
     * --------------------------------------------------- */
    .then(() => {
      if (facultyTaughtModuleIDs) {
        Student.find({}).then(students => {
          if (students) {
            students.forEach(student => {
              facultyTaughtModuleIDs.forEach(facultyTaughtModuleID => {
                student.taughtModules.forEach(studentTaughtModule => {
                  const studentTaughtModuleID = studentTaughtModule.taughtModuleID.toString();
                  if (
                    studentTaughtModuleID === facultyTaughtModuleID.toString()
                  ) {
                    studentTaughtModule.remove();
                  }
                });
              });
              // Save changes in Database
              student.save().catch(err => {
                // Catch any errors
                console.log(err.message);
                return;
              });
            });
          }
        });
      }
    })
    /* REMOVE "MODULES" FROM "modules" COLLECTION
     * --------------------------------------------------- */
    .then(() => {
      Module.find({}).then(modules => {
        if (modules) {
          modules.forEach(module => {
            uiCourseIds.forEach(uiCourseID => {
              const dbCourseID = module.courseID.toString();
              if (dbCourseID === uiCourseID) {
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
    /* DELETE COURSES FROM "courses" COLLECTION
     * --------------------------------------------------- */
    .then(() => {
      Course.find().then(courses => {
        if (courses) {
          courses.forEach(course => {
            const dbCourseID = course.id;
            uiCourseIds.forEach(uiCourseID => {
              if (dbCourseID === uiCourseID) {
                Course.deleteOne({ _id: dbCourseID })
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

  /* FLASH SUCCESS MESSAGE & REDIRECT BACK TO THE PAGE
   * --------------------------------------------------- */
  req.flash("success_msg", "Courses deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

/* ------------------------------------------------
 * FORM MODULES
 * ------------------------------------------------ */
// ---------------- Create Module ----------------
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

// ---------------- Edit Module ----------------
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

// ---------------- Delete Module ----------------
router.delete("/facultyMember/modules/", (req, res) => {
  // ======== Delete Modules ========
  // Get the selected module ids
  let uiModuleIdsToDelete = req.body.modulesID;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof uiModuleIdsToDelete === "string") {
    let idArray = [];
    idArray.push(uiModuleIdsToDelete);
    uiModuleIdsToDelete = idArray;
  }

  /**
   * Remove "taught modules" which are related to deleted modules
   * from every "faculty member"
   */
  FacultyMember.find({})
    .populate("taughtModules.moduleID")
    .then(members => {
      if (members) {
        members.forEach(member => {
          uiModuleIdsToDelete.forEach(uiID => {
            member.taughtModules.forEach(taughtModule => {
              if (taughtModule.moduleID.id === uiID) {
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
      uiModuleIdsToDelete.forEach(uiID => {
        Module.deleteOne({ _id: uiID })
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

/* ------------------------------------------------
 * FORM DASHBOARD
 * ------------------------------------------------ */
// -------- Update "Facultymember" Collection - Add Taught Modules --------
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

// -------- Update "Student" Collection - Add Taught Modules --------
router.post("/student/taughtModules/:id", (req, res) => {
  /* GATHER UI DATA
   * ----------------------------------------------- */
  let uiTaughtModuleIds = req.body.moduleIDs;

  /* PREPARE UI DATA FOR PROCESSING
   * ----------------------------------------------- */
  if (typeof uiTaughtModuleIds === "string") {
    //  ---- Convert to an array of one object ----
    let idArray = [];
    idArray.push(uiTaughtModuleIds);
    uiTaughtModuleIds = idArray;
  }

  /* ADD ONE OR MORE MODULES TO "STUDENTS" COLLECTION
   * ----------------------------------------------- */
  Student.findOne({ userID: req.params.id })
    .then(student => {
      if (student) {
        // ---- Update "taughtModule" Table In "students" Collection ----
        uiTaughtModuleIds.forEach(id => {
          const module = {
            taughtModuleID: id
          };
          student.taughtModules.push(module);
        });

        // ------------ Save Changes In Database ------------
        student.save().catch(err => {
          console.log(
            `router.post("/student/taughtModules/:id") ${err.message}`
          );
          req.flash(
            "error_msg",
            `Adding modules into "students" collection error: ${err.message}`
          );
          res.redirect("/dashboards/student");
          return;
        });
      }
    })
    .then(() => {
      /* ADD "GRADES" INTO "FACULTYMEMBERS" COLLECTION
       * ----------------------------------------------- */
      FacultyMember.find({}).then(members => {
        if (members) {
          // ---- Update "grades" Table In "facultymembers" Collection ----
          members.forEach(member => {
            uiTaughtModuleIds.forEach(uiID => {
              member.taughtModules.forEach(taughtModule => {
                if (taughtModule.id === uiID) {
                  const grade = {
                    studentID: req.params.id,
                    mark: ""
                  };
                  taughtModule.grades.push(grade);
                }
              });
            });
            // ------------ Save Changes In Database ------------
            member.save().catch(err => {
              console.log(
                `router.post("/student/taughtModules/:id") ${err.message}`
              );
              req.flash(
                "error_msg",
                `Adding grades into "facultymembers" collection error: ${err.message}`
              );
              res.redirect("/dashboards/student");
              return;
            });
          });
        }
      });
    })
    .then(() => {
      // ======== Flash Success Message & Redirect Back To The Page ========
      req.flash("success_msg", "Modules have been added successfully.");
      res.redirect("/dashboards/student");
    });
});

// -------- Update "Facultymember" Collection - Delete Taught Modules --------
router.delete("/facultyMember/taughtModules/:id", (req, res) => {
  // Get the selected module ids
  let uiModuleIdsToDelete = req.body.modulesID;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof uiModuleIdsToDelete === "string") {
    let idArray = [];
    idArray.push(uiModuleIdsToDelete);
    uiModuleIdsToDelete = idArray;
  }

  // ==== Remove Taught Modules Form Faculty Member Collection ====
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        uiModuleIdsToDelete.forEach(uiID => {
          member.taughtModules.forEach(taughtModule => {
            const dbModuleID = taughtModule.moduleID.id;
            // console.log(`moduleID ${typeof dbModuleID}`);
            // console.log(`ID ${typeof uiID}`);
            if (dbModuleID === uiID) {
              taughtModule.remove();
            }
          });
        });
      }
      // Save changes in Database
      member.save().catch(err => {
        // Catch any errors
        console.log(err.message);
        return;
      });
    });

  // ======== Flash Success Message & Redirect Back To The Page ========
  req.flash("success_msg", "Taught Modules have been deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

// -------- Update "Students" Collection - Delete Taught Modules --------
router.delete("/student/taughtModules/:id", (req, res) => {
  /* GATHER UI DATA
   * ----------------------------------------------- */
  let uiTaughtModuleIds = req.body.moduleIDs;

  /* PREPARE UI DATA FOR PROCESSING
   * ----------------------------------------------- */
  if (typeof uiTaughtModuleIds === "string") {
    //  ---- Convert To An Array Of One Object ----
    let idArray = [];
    idArray.push(uiTaughtModuleIds);
    uiTaughtModuleIds = idArray;
  }

  /* DELETE ONE OR MORE "TAUGHT MODULES" FROM "students" COLLECTION
   * --------------------------------------------------------------- */
  Student.findOne({ userID: req.params.id })
    .then(student => {
      if (student) {
        uiTaughtModuleIds.forEach(uiID => {
          student.taughtModules.forEach(taughtModule => {
            let dbModuleID = taughtModule.taughtModuleID.toString();
            if (dbModuleID === uiID) {
              taughtModule.remove();
            }
          });
        });
      }
      student.save().catch(err => {
        // Catch Any Errors
        console.log(
          `router.delete("/student/taughtModules/:id") ${err.message}`
        );
        req.flash(
          "error_msg",
          `Deleting modules into "students" collection error: ${err.message}`
        );
        res.redirect("/dashboards/student");
        return;
      });
    })
    .then(() => {
      /* DELETE "grades" FROM "facultymembers" COLLECTION
       * ----------------------------------------------------------- */
      FacultyMember.find({}).then(members => {
        if (members) {
          // -- Update "taughtModules" Table In "facultymembers" Collection
          members.forEach(member => {
            uiTaughtModuleIds.forEach(uiID => {
              member.taughtModules.forEach(taughtModule => {
                if (taughtModule.id === uiID) {
                  taughtModule.grades.forEach(grade => {
                    let dbGradeStudentID = grade.studentID.toString();
                    if (dbGradeStudentID === req.params.id) {
                      grade.remove();
                    }
                  });
                }
              });
            });
            // ------------ Save Changes In Database ------------
            member.save().catch(err => {
              console.log(
                `router.post("/student/taughtModules/:id") ${err.message}`
              );
              req.flash(
                "error_msg",
                `Deleting modules into "facultymembers" collection error: ${err.message}`
              );
              res.redirect("/dashboards/student");
              return;
            });
          });
        }
      });
    })
    .then(() => {
      // ---- Flash Success Message & Redirect Back To The Page ----
      req.flash("success_msg", "Modules have been deleted successfully.");
      res.redirect("/dashboards/student");
    });
});

// -------- Update "facultymember Collection" - Add Courseworks --------
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

// -------- Update "facultymember Collection" - Update Courseworks --------
router.put("/facultyMember/courseworks/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let updateCoursework = false;
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
            updateCoursework = true;
          }
        });
      }

      if (updateCoursework) {
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

// -------- UPDATE "facultymember" COLLECTION - DELETE COURSEWORKS --------
router.delete("/facultyMember/courseworks/:id", (req, res) => {
  // Get the selected module ids
  let uiTaughtModuleIdsToDelete = req.body.taughtModulesID;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof uiTaughtModuleIdsToDelete === "string") {
    let idArray = [];
    idArray.push(uiTaughtModuleIdsToDelete);
    uiTaughtModuleIdsToDelete = idArray;
  }

  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      if (member) {
        uiTaughtModuleIdsToDelete.forEach(uiID => {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule._id.toString() === uiID) {
              taughtModule.coursework = undefined;
            }
          });
        });
      }
      // Save changes in Database
      member.save().catch(err => {
        // Catch any errors
        console.log(err.message);
        return;
      });
    });
  // ======== Flash Success Message & Redirect Back To The Page ========
  req.flash("success_msg", "Courseworks have been deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

// -------- Update "facultymember Collection" - Add Exams --------
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

// -------- Update "facultymember Collection" - Update Exams --------
router.put("/facultyMember/exams/:id", (req, res) => {
  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let updateExam = false;
      if (member) {
        // ---- Get the data from UI form ----
        const uiTaughtModuleID = req.body.taughtModuleID;
        const uiExamDate = req.body.date;
        const uiExamTime = req.body.time;
        const uiExamClassroom = req.body.classroom;

        // ---- Update Data ----
        member.taughtModules.forEach(taughtModule => {
          if (
            taughtModule._id.toString() === uiTaughtModuleID &&
            uiExamDate !== "" &&
            uiExamTime !== "" &&
            uiExamClassroom !== ""
          ) {
            let uiDate = new Date(uiExamDate);
            let uiTime = uiExamTime.split(":");
            uiDate.setHours(uiTime[0], uiTime[1], 0);
            const newExam = {
              date: uiDate,
              classroom: uiExamClassroom
            };
            taughtModule.exam = newExam;
            updateExam = true;
          }
        });
      }

      if (updateExam) {
        // Save to the database
        member
          .save()
          .then(member => {
            req.flash("success_msg", "Exam has been updated successfully.");
            res.redirect("/dashboards/facultyMember");
          })
          .catch(err => {
            // Catch any errors
            console.log(err.message);
            return;
          });
      } else {
        req.flash(
          "error_msg",
          "Something went wrong on updating exam. One or more field were not filled in. Please try again."
        );
        res.redirect("/dashboards/facultyMember");
      }
    });
});

// -------- Update "facultymember" Collection - Delete Exams --------
router.delete("/facultyMember/exams/:id", (req, res) => {
  // Get "taught module" ids
  let uiTaughtModuleIDs = req.body.taughtModulesID;

  /* In case of only one "module" is selected to delete, the "id" is a string.
   *  In order to delete the "module" it needs to be converted to an array of
   *  one object.
   */
  //  ---- Convert to an array of one object ----
  if (typeof uiTaughtModuleIDs === "string") {
    let idArray = [];
    idArray.push(uiTaughtModuleIDs);
    uiTaughtModuleIDs = idArray;
  }

  FacultyMember.findOne({ userID: req.params.id })
    .populate("taughtModules.moduleID")
    .then(member => {
      let deleteExams = false;
      if (member) {
        uiTaughtModuleIDs.forEach(uiID => {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule._id.toString() === uiID) {
              taughtModule.exam = undefined;
              deleteExams = true;
            }
          });
        });
      }
      // Save changes in Database
      member.save().catch(err => {
        // Catch any errors
        console.log(err.message);
        return;
      });
    });
  // ======== Flash Success Message & Redirect Back To The Page ========
  req.flash("success_msg", "Exams have been deleted successfully.");
  res.redirect("/dashboards/facultyMember");
});

// -------- Get Taught Module "Grades" --------
router.get("/facultyMember/taughtModules/grades/:id", (req, res) => {
  FacultyMember.find({})
    .populate("taughtModules.grades.studentID")
    .then(members => {
      if (members) {
        /* GET GRADES FROM THE TAUGHT MODULE
         * ----------------------------------------------- */
        let data = [];
        members.forEach(member => {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule.id === req.params.id) {
              let dbTaughtModule = {};
              dbTaughtModule = {
                taughtModuleID: taughtModule.id
              };
              data.push(dbTaughtModule);
              let gradesTable;
              let row = {};
              gradesTable = taughtModule.grades;
              gradesTable.forEach(grade => {
                row = {
                  studentID: grade.studentID.id,
                  studentName: grade.studentID.name,
                  mark: grade.mark
                };
                data.push(row);
              });
            }
          });
        });

        /* RETURN DATA TO THE CLIENT
         * ----------------------------------------------- */
        res.json(data);
      }
    })
    .catch(err => {
      // Catch any errors
      console.log(err.message);
      return;
    });
});

// -------- Update "facultymember" Collection - Add Grades --------
router.post("/facultyMember/taughtModules/grades/:id", (req, res) => {
  /* GATHER NECESSARY UI DATA
   * ----------------------------------------------- */
  const ui = req.body;

  /* PREPARE UI DATA FOR PROCESSING
   * ----------------------------------------------- */
  const uiData = [];
  if (typeof ui.studentID === "string") {
    const data = {
      studentID: ui.studentID,
      grade: ui.grade
    };
    uiData.push(data);
  } else {
    ui.studentID.forEach((id, index) => {
      const data = {
        studentID: id,
        grade: ui.grade[index]
      };
      uiData.push(data);
    });
  }
  
  /* UPDATE "GRADES" INTO "facultymembers" COLLECTION
   * ----------------------------------------------- */
  FacultyMember.find({})
    .then(members => {
      if (members) {
        members.forEach(member => {
          member.taughtModules.forEach(taughtModule => {
            if (taughtModule.id === ui.taughtModuleID) {
              taughtModule.grades.forEach(grade => {
                uiData.forEach(item => {
                  if (item.studentID === grade.studentID.toString()) {
                    grade.mark = item.grade;
                  }
                });
              });
            }
          });

          // ------------ Save Changes In Database ------------
          member.save().catch(err => {
            console.log(
              `router.post("/dashboards/facultyMember/taughtModules/grades/:id") ${err.message}`
            );
            req.flash(
              "error_msg",
              `Adding grades into "facultymembers" collection error: ${err.message}`
            );
            res.redirect("/dashboards/facultyMember");
            return;
          });
        });
      }
    })
    /* UPDATE "GRADES" INTO "students" COLLECTION
     * ----------------------------------------------- */
    .then(() => {
      uiData.forEach(item => {
        Student.findOne({ userID: item.studentID }).then(student => {
          if (student) {
            student.taughtModules.forEach(taughtModule => {
              if (
                taughtModule.taughtModuleID.toString() === ui.taughtModuleID
              ) {
                taughtModule.mark = item.grade;
                // console.log(taughtModule);
              }
            });

            // ------------ Save Changes In Database ------------
            student.save().catch(err => {
              console.log(
                `router.post("/dashboards/facultyMember/taughtModules/grades/:id") ${err.message}`
              );
              req.flash(
                "error_msg",
                `Adding grades into "students" collection error: ${err.message}`
              );
              res.redirect("/dashboards/facultyMember");
              return;
            });
          }
        });
      });
    })
    /* FLASH SUCCESS MESSAGE & REDIRECT BACK TO THE PAGE
     * --------------------------------------------------- */
    .then(() => {
      req.flash("success_msg", "Grades have been saved successfully.");
      res.redirect("/dashboards/facultyMember");
    });
});

// console.log(`db.id: ${typeof(courseID)} - req.param.id: ${typeof(req.params.id)}, db.name: ${typeof(course.name)} - req.body.name: ${typeof(req.body.name)}, db.degree: ${typeof(course.name)} - req.body.degree: ${typeof(req.body.degree)}`);

/* ================================================
 * EXPORT MODULE
 * ================================================ */
module.exports = router;

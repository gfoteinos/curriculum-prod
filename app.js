
// ======== Import Required Modules ========

const express = require('express');
// const fs = require('fs'); // Access & interact with the file system
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


// ==== Initialize App - Create The Express Application ====

const app = express();


// ======== Load Routes ========

const users = require('./routes/users');
const dashboards = require('./routes/dashboards');


// ======== Load Passport Config ========

require('./config/passport')(passport);


// ======== Database ========

// DB config - Link the config/database.js file 
const db = require('./config/database');

// Connect to the database (with mongoose)
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => { console.log('MongoDB connected ...') })
  .catch(err => { console.log(err) });

// //Load models
// require('./models/FacultyMember');
// const FacultyMember = mongoose.model('facultyMembers')


// ======== Middlewares ========

// var hbs = exphbs.create({
//   // Specify helpers which are only registered on this instance.
//   helpers: {
//     ifEquals: function (arg1, arg2, options) { 
//       return (arg1 == arg2) ? options.fn(this) : options.inverse(this); 
//     },
//   }
// });

var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
});

// Handlebars middleware 
app.engine('handlebars', exphbs());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Body-parse middleware 
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json());

// // Body-parse middleware 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Express-session middleware 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// -------- Flash messaging --------

// Connect-flash middleware 
app.use(flash());

// Global variables for flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // Global variable for login user or not  
  res.locals.user = req.user || null;
  next();
})
// --------------------------------

// Path middleware - Set "public" folder to be the "express static" folder 
app.use(express.static(path.join(__dirname, 'public')));

// Method-override middleware
app.use(methodOverride('_method'));



// ======== Routes ========

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Welcome'
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});


// ======== Use Routes ========
app.use('/users', users);
app.use('/dashboards', dashboards);


// ======== Start up the server on port 5000 ========

// Listen to certain port 
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

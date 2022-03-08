let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");

// modules for authentication
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let flash = require("connect-flash");

let passportJWT = require("passport-jwt");
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to the DB URI
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

let userRouter = require('../routes/user');
let incidentRouter = require('../routes/incident');

let app = express();
// app.use(cors);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token,responseType");
  next();
});

// app.use('/', express.static(path.join(__dirname, '../build')));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'))
// });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// app.use(cors);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));

//setup express session
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
  })
);

// initialize flash
// app.use(flash());

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// create a User Model Instance
let userModel = require('../model/user');
let User = userModel.User;

// implement a User Authentication Strategy
// passport.use(User.createStrategy());

// serialize and deserialize the User info
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// let jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = DB.Secret;

// let strategy = new JWTStrategy(jwtOptions, (jwt_payload, done) => {
//   User.findById(jwt_payload.id)
//     .then((user) => {
//       return done(null, user);
//     })
//     .catch((err) => {
//       return done(err, false);
//     });
// });

// passport.use(strategy);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/incident', incidentRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

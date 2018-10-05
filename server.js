const express = require('express');
const passport = require('passport');
const strategy = require('passport-facebook').Strategy;

var port = process.env.PORT || 3000;

passport.use(new Strategy({
  clienID: "146724319613131",
  clientSecret: "90c0eed01e47d4f2433efeb87b6f05ad",
  callbackURL: "http://localhost:3000/login/facebook/return"
}, function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

var app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: "lco app", resave: true, saveUninitialized: true }));

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/login/facebook", passport.authenticate("facebook"));

app.get("/login/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), function (req, res) {
  res.redirect("/");
});

app.get("/profile", require('connect-ensure-login').ensureLoggedIn(), (req, res) {
  res.render("profile", { user: req.user });
});

app.listen(port, () => console.log("Server is running at port 3000"));
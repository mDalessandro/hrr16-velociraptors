var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var path = require('path');

// ask tyrus location of db #15
// var db = require('./db.js');

var app = express();
app.use(session({
  secret: 'Greenfield STEM',
  cookie: { maxAge: 60 * 1000 }, // 1 minute I believe
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ask mat and steven static file location
app.use(express.static(path.resolve(__dirname + '/../client/public')));

app.route('/')
.get(function(req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.route('/api/tags')
.get(function(req, res){
  // check to see whether there is a user query
  if (req.query.username) {
    // check to see if username exists
    // if exists, send back list of tag:coord pairs
    // the list is an array of objects, each object is {name: 'myHouse', coord: {lat: 3.3425, long: 1.50588}}
    // else send back empty array
  } else if (req.query.tag) {
    // if tag exists send back array with the single result
    // else send back empty array
  } else {
    // send back a list of entire database
  }
})
.post(function(req, res) {
  // check to see whether user is authenticated
  if (req.session.username) {
    // user is authenticated
    // check to see whether that tag already exists
    // if new tag: insert in DB and send back 201 returns inserted data
    // if tag taken: send back 409 Conflict
  } else {
    // user is not authenticated
    res.sendStatus(403);
  }
});

app.route('/profile')
.get(function (req, res) {
  // check whether user is authenticated
  if (req.session.username) {
    // user is authenticated
    // serve corresponding files
    res.sendFile(path.resolve(__dirname + '/../client/app/profile/profile.html'))
  } else {
    // user is not authenticated
    res.redirect('/signin');
  }
});

app.route('/signin')
.get(function(req, res) {
  if (req.session.username) {
    res.redirect('/profile');
  } else {
    res.sendFile(path.resolve(__dirname + '/../client/app/auth/signin.html'));
  }
})
.post(function(req, res) {
  // check to see whether already authenticated
  if (req.session.username) {
    res.redirect('/profile');
  } else {
    // user not authenticated
    // extract username and password from body
    var username = req.body.username;
    var password = req.body.password;
    // check db whether the user already exists
    // if user does not exist
    // insert his info in database
    // if user already exists
    // send back 403 error

    // temporary code
    req.session.username = req.body.username;
    res.redirect('/profile');
  }
});

app.route('/signup')
.get(function(req, res) {
  if (req.session.username) {
    res.redirect('/profile');
  } else {
    res.sendFile(path.resolve(__dirname + '/../client/app/auth/signup.html'));
  }
})
.post(function(req, res) {
  // check to see whether already authenticated
  if (req.session.username) {
    // is authenticated
    res.redirect('/profile');
  } else {
    // not authenticated
    // extract username and password from body
    var username = req.body.username;
    var password = req.body.password;
    // check db whether the user already exists
    // if user does not exist
    // insert his info in database
    // if user already exists
    // send back 403 error

    // temporary code
    req.session.username = req.body.username;
    res.redirect('/profile');
  }
});

app.route('/*')
.get(function (req, res) {
  res.redirect('/');
});


module.exports = app;

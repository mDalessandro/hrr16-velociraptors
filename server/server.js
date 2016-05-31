var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var path = require('path');
var User = require('./users/userModel');
var Tag = require('./tags/tagModel');

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
    var username = req.query.username;
    User.findOne({'username': username}, function(err, result){
      if (err){
        res.statusCode = 200;
        res.send('[]');
      } else {
        Tag.find({'username': username}, function(err, result){
          if (err){
            res.statusCode = 200;
            res.send('User has not created any tags yet');
          } else {
            res.statusCode = 200;
            res.send(result);
          }
        })
      }
    })
  } else if (req.query.tag) {
    // if tag exists send back array with the single result
    // else send back empty array
      var tag = req.query.tag;
      Tag.findOne({'tagname': tag}, function(err, result){
        if (err){
          res.statusCode = 200;
          res.send('[]');
        } else {
          res.statusCode = 200;
          res.send(result);
        }
      });
  } else {
    // send back a list of entire database
      Tag.find({}, function(err, result){
      if (err){
        res.statusCode = 400;
        res.end();
      } else {
        res.statusCode = 200;
        res.send(result);
      }
    })
  }
})
.post(function(req, res) {
  // check to see whether user is authenticated
  if (req.session.username) {
    // user is authenticated
    // check to see whether that tag already exists
    // if new tag: insert in DB and send back 201 returns inserted data
    // if tag taken: send back 409 Conflict
    Tag.findOne({'tagname': tag}, function(err, result){
      var user = req.body.username;
      var tag  = req.body.tagname;
      var lat  = req.body.lat;
      var long = req.body.long;
      if (err){
        res.statusCode = 201;
        var newTag = new Tag({'username': user, 'tagname': tag, 'lat': lat, 'long': long});
        console.log(newTag);
        res.send(newTag);

      } else {
        res.statusCode = 409;
        console.log("Tag already exists")
        res.end();
      }
    });
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
    // check db whether the user already exists
    // if user does not exist
    // insert his info in database
    // if user already exists
    // send back 403 error
    var username = req.body.username;
    var password = req.body.password;
    var name     = req.body.name;
    var email    = req.body.email;
    User.findOne({'username': username}, function(err, result){
      if (err){
        res.statusCode = 201;
        var newUser = new User({'username': username, 'password': password, 'name': name, 'email': email});
        console.log(newUser);
        res.send(newUser);

      } else {
        res.statusCode = 409;
        console.log("User already exists")
        res.end();
      }
    });

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

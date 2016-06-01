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
  cookie: { maxAge: 60 * 1000 }, // 1 minute
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname + '/../client/public')));

app.route('/')
.get(function(req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.route('/api/tags')
.get(function(req, res, next){
  // check whether there is a user query
  if (req.query.username) {
    // check to see if username exists
    // if exists, send back list of tag:coord pairs
    // the list is an array of objects, each object is {name: 'myHouse', coord: {lat: 3.3425, long: 1.50588}}
    // else send back empty array
    var username = req.query.username;
    User.findOne({'username': username}, function(err, user){
      // findOne will return null if no matches
      // http://mongoosejs.com/docs/api.html#query_Query-findOne
      if (err){
        console.log(err);
        next(err);
      } else {
        if (user) {
          // user `username` found
          Tag.find({'username': username}, function(err, tags){
            // `find` will return empty array [] if no matches
            // http://stackoverflow.com/questions/18214635/what-is-returned-from-mongoose-query-that-finds-no-matches
            if (err){
              console.log(err);
              next(err);
            } else {
              res.json(tags);
            }
          });
        } else {
          // user `username` not found
          res.json([]);
        }
      }
    });
  } else if (req.query.tag) {
    // if tag exists send back array with the single result
    // else send back empty array
      var tag = req.query.tag;
      Tag.findOne({'tagname': tag}, function(err, tag){
        if (err){
          console.log(err);
          next(err);
        } else {
          tag ? res.json(tag) : res.json([]);
        }
      });
  } else {
    // send back a list of entire database
      Tag.find({}, function(err, tags){
      if (err){
        console.log(err);
        next(err);
      } else {
        res.json(tags);
      }
    });
  }
})
.post(function(req, res, next) {
  // check to see whether user is authenticated
  if (req.session.username) {
    // user is authenticated
    // check to see whether that tag already exists
    // if new tag: insert in DB and send back 201 returns inserted data
    // if tag taken: send back 409 Conflict
    var username = req.body.username;
    var tag  = req.body.tagname;
    var lat  = req.body.lat;
    var long = req.body.long;
    Tag.findOne({'tagname': tag}, function(err, tag){
      if (err){
        console.log(err);
        next(err);
      } else {
        if (tag) {
          res.sendStatus(409);
          console.log("Tag already exists")
        } else {
          // Uncomment if ES6 not working
          // var newTag = new Tag({'username': username, 'tagname': tag, 'lat': lat, 'long': long});
          var newTag = new Tag({username, tag, lat, long});
          newTag.save(function (err, tag) {
            res.status(201).json(tag);
          });
        }
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
    // check db for user credentials
    // if credentials pass assign session username, redirect to /profile
    req.session.username = req.body.username;
    res.redirect('/profile');
    // if credentials dont match send back 403 error
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
.post(function(req, res, next) {
  // check to see whether already authenticated
  if (req.session.username) {
    // is authenticated
    res.redirect('/profile');
  } else {
    // not authenticated
    // extract username and password from body
    // check db whether the user already exists
    // if user does not exist
    // insert user info in database
    var salt = bcrypt.genSaltSync(5);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var user = {
      email: req.body.email,
      name: req.body.name,
      password: hash,
      username: req.body.username
    };
    // if user already exists
    // send back 409 error
    var username = req.body.username;
    var password = req.body.password;
    var name     = req.body.name;
    var email    = req.body.email;
    User.findOne({'username': username}, function(err, user){
      if (err){
        console.log(err);
        next(err);
      } else {
        if (user) {
          console.log("User already exists");
          res.sendStatus(409);
        } else {
          var newUser = new User({'username': username, 'password': password, 'name': name, 'email': email});
          newUser.save(function (err) {
            if (err) {
              console.log(err);
              next(err);
            } else {
              console.log(newUser);
              res.redirect('/profile');
            }
          });
        }
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

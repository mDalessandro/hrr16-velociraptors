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

app.use(express.static(path.resolve(__dirname + '/../client/')));

app.route('/')
.get(function(req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.route('/api/tags')
.get(function(req, res, next){
  // check whether there is a user query
  if (req.query.username) {
    // check to see if username exists
    var username = req.query.username;
    User.findOne({'username': username}, function(err, user){
      // findOne will return null if no matches
      // http://mongoosejs.com/docs/api.html#query_Query-findOne
      if (err){
        console.log(err);
        next(err);
      } else {
        if (user) {
          // user exists, send back list of user's tags
          Tag.find({'username': username}, function(err, tags){
            // `tags` is an array of objects, each object is {tagname: 'myHouse', username: lat: 3.3425, long: 1.50588}
            // `find` will populate `tags` with empty array [] if no matches
            // http://stackoverflow.com/questions/18214635/what-is-returned-from-mongoose-query-that-finds-no-matches
            if (err){
              console.log(err);
              next(err);
            } else {
              res.json(tags);
            }
          });
        } else {
          // user `username` not found, send back empty array
          res.json([]);
        }
      }
    });
  } else if (req.query.tag) {
      var tag = req.query.tag;
      Tag.findOne({'tagname': tag}, function(err, tag){
        if (err){
          console.log(err);
          next(err);
        } else {
          // send back array with the single result if tag found
          // else send back empty array
          tag ? res.json(tag) : res.json([]);
        }
      });
  } else {
    // send back a list of all tags in DB
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
  // check whether user authenticated
  if (req.session.username) {
    // user authenticated
    var username = req.body.username; // should actually be req.session.username
    var tagname  = req.body.tagname;
    var lat  = req.body.lat;
    var long = req.body.long;
    // check to see whether that tag already exists
    Tag.findOne({'tagname': tagname}, function(err, tag){
      if (err){
        console.log(err);
        next(err);
      } else {
        if (tag) {
          // tag taken, 409 Conflict
          res.sendStatus(409);
        } else {
          // tag not taken: insert in DB, respond 201 + tag data
          // Uncomment if ES6 not working
          // var newTag = new Tag({'username': username, 'tagname': tag, 'lat': lat, 'long': long});
          var newTag = new Tag({username, tagname, lat, long});
          newTag.save(function (err, tag) {
            res.status(201).json(tag);
          });
        }
      }
    });
  } else {
    // user not authenticated
    res.sendStatus(403);
  }
});

app.route('/logout')
.get(function(req, res) {
  req.session.destroy(function (err) {
    res.sendStatus(200);
  });
})

app.route('/profile')
.get(function (req, res) {
  // check whether user authenticated
  if (req.session.username) {
    // user is authenticated
    // serve profile page
    res.sendFile(path.resolve(__dirname + '/../client/app/profile/profile.html'))
  } else {
    // user not authenticated
    res.redirect('/signin');
  }
});

app.route('/signin')
.get(function(req, res) {
  if (req.session.username) {
    // user authenticated, send to profile
    // res.redirect('/profile');
    res.sendStatus(200);
  } else {
    // user not authenticated, serve signin page
    // res.sendFile(path.resolve(__dirname + '/../client/app/auth/signin.html'));
    res.sendStatus(403);
  }
})
.post(function(req, res) {
  if (req.session.username) {
    // user authenticated
    res.sendStatus(200);
  } else {
    // user not authenticated
    var username = req.body.username;
    var password = req.body.password;
    // check db for user credentials
    User.findOne({'username': username}).then(function(user){
      if (!user){
        // no user with that name found
        res.sendStatus(404);
      } else {
        // there is a user by that name
        return user.comparePasswords(password).then(function (match) {
          if (match) {
            req.session.username = username;
            // res.redirect('/profile');
            res.sendStatus(200);
          } else {
            res.sendStatus(403);
          }
        });
      }
    }).catch(function (error) {
      console.log('Invalid username/password combination');
      res.sendStatus(403);
    });
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
  if (req.session.username) {
    // is authenticated
    // res.redirect('/profile');
    res.sendStatus(200);
  } else {
    // not authenticated
    var username = req.body.username;
    var password = req.body.password;
    var name     = req.body.name;
    var email    = req.body.email;
    var userInfo = {email, name, password, username};

    // check whether user exists
    User.findOne({'username': username}).then(function(user){
      if (user) {
        // user `username` already exists
        console.log('User already exist');
        res.sendStatus(409);
      } else {
        // user `username` does not exist
        // console.log('User ', username, ' does not exist');
        var newUser = new User(userInfo);
        return newUser.save(function (err) {
          if (err) {
            console.log('Bad/missing registration details');
            res.sendStatus(400);
          } else {
            req.session.username = username;
            res.sendStatus(201);
          }
        });
      }
    }).catch(function (error) {
      console.log('Invalid user details provided');
      res.sendStatus(400);
    });
  }
});

module.exports = app;

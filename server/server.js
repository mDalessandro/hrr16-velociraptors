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

// GET routes
app.get('/', function(req, res, next){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

module.exports = app;

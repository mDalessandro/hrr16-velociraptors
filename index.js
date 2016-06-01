var app = require('./server/server.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

port = process.env.PORT || 3000;
app.listen(port);
console.log('Server started on port ', port);

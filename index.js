var app = require('./server/server.js');
var mongoose = require('mongoose');

mongoURI = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/greenfield';
mongoose.connect(mongoURI);

port = process.env.PORT || 3000;
app.listen(port);
console.log('Server started on port ', port);

var app = require('./server/server.js');

port = process.env.PORT || 3000;
app.listen(port);
console.log('Server started on port ', port);

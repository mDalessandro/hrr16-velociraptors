var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
 tagname: String,
 username: String,
 lat: String,
 long: String
});

module.exports = mongoose.model('tags', TagSchema);


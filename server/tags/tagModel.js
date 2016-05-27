var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
 tagname: String,
 coordinates: String,
 username: String,
});

module.exports = mongoose.model('tags', TagSchema);


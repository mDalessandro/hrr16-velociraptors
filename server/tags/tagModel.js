var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
 tagname: {
  type: String,
  required: true
  },
 username: {
  type: String,
  required: true
  },
 lat: {
  type: String,
  required: true
  },
 long: {
  type: String,
  required: true
  }
});

module.exports = mongoose.model('tags', TagSchema);


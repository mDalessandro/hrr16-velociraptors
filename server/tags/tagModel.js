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
    required: true,
    validate: {
      validator: function (lat) {
        return Number(lat) >= -90 && Number(lat) <= 90;
      },
    message: 'Latitude out of bounds, [-90, 90]'
    }
  },
  long: {
    type: String,
    required: true,
    validate: {
      validator: function (long) {
        return Number(long) >= -180 && Number(long) <= 180;
      },
    message: 'Longitude out of bounds, [-180, 180]'
    }
  }
});

module.exports = mongoose.model('tags', TagSchema);

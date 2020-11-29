const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  city: {
    type: String
  },
});

const City = mongoose.model('Note', CitySchema)

module.exports = { City: City };

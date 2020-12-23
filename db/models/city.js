const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  city: {
    type: String
  }
});



const City = mongoose.model('City', CitySchema)
const fidnAll = City.find({});
module.exports = { City: City };

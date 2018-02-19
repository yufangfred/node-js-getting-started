// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var betSchema = new Schema({
  team2: {
    bet: String,
    name: String,

  },
  tournament: String,
  simple_title: String,
  team1: {
    bet: String,
    name: String,

  },
  url: String,
  game: String,
  meta: String,
  bet_on: String,
  amount: Number,
  usr_id: String
});

// the schema is useless so far
// we need to create a model using it
var bet_record = mongoose.model('bet_record', betSchema);

// make this available to our users in our Node applications
module.exports = bet_record;
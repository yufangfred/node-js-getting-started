// app/models/match.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our match model
var matchSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    balance: {
        type: Number, 
        default: 500
    },
    history: {
        id : String
    }


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Mach', matchSchema);
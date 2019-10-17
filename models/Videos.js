const mongoose = require('mongoose');

const videosSchema = mongoose.Schema({
    video: {type: String, default: ''},
    team1: {type: String, default: ''},
    team2: {type: String, default: ''},
});

module.exports = mongoose.model('Videos', videosSchema);
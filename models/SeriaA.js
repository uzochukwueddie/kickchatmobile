const mongoose = require('mongoose');

const seriaA = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    fans: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }]
});

module.exports = mongoose.model('Italy', seriaA);
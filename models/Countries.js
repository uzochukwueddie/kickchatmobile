const mongoose = require('mongoose');

const countryNames = mongoose.Schema({
    name: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    fans: [{
        username: {type: String, default: ''},
    }]
});

module.exports = mongoose.model('Country', countryNames);
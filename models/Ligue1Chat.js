const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({  
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: {type: String, default: ''},
    room: {type: String},
    imageVersion: {type: String, default: ''},
    imageId: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('LigueOneChat', msgSchema); 
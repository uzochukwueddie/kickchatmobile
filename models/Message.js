const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({  
    conversationId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'
    },
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            body: {type: String, default: ''},
            isRead: {type: Boolean, default: false},
            imageVersion: {type: String, default: ''},
            imageId: {type: String, default: ''},
            createdAt: {type: Date, default: Date.now},
        }
    ]
});

module.exports = mongoose.model('Message', messageSchema); 
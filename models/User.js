const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    facebook: {type: String, default: ''},
    fbToken: {type: String, default: ''},
    google: {type: String, default: ''},
    googleToken: {type: String, default: ''},
    posts: [
        {
            postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
            created: { type: Date, default: Date.now() }
        }
    ],
    following: [
        { 
            userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            blocked: { type: Boolean, default: false }
        }
    ],
    followers: [
        { 
            follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            blocked: { type: Boolean, default: false }
        }
    ],
    notifications: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: { type: String },
            viewProfile: { type: Boolean, default: false },
            created: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: '' }
        }
    ],
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
        }
    ],
    sentRequest: [{ // remove
        username: {type: String, default: ''}
    }],
    request: [{// remove
        username: {type: String, default: ''},
        senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    friends: [{// remove
        name: {type: String, default: ''},
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    notFriends: [{// remove
        name: {type: String, default: ''},
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    imageVersion: { type: String, default: '1521534486' },
    userImage: { type: String, default: 'defaultPic.png' },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' },
            created: { type: Date, default: Date.now() },
        }
    ],
    city: { type: String, default: '' },
    club: {type: String, default: ''},
    country: { type: String, default: '' },
    gender: {type: String, default: ''},
    mantra: {type: String, default: ''},
    blockedUsers: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ],
    blockedBy: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ],
    totalRequest: {type: Number, default: 0},
    favClub: [],
    favTeams: [],
    favPlayers: [],
    coords: {
        latitude: {type: String, default: ''},
        longitude: {type: String, default: ''},
    },
    passwordResetToken: {type: String, default: ''},
    passwordResetExpires: {type: Date, default: Date.now},
    profileViewCount: { type: Number, default: 0 },
    joined: {type: Date, default: Date.now},
    lastVisited: {type: Date, default: Date.now},
    online: { type: Boolean, default: false },
    socketId: {type: String, default: ''}
});

userSchema.statics.encryptPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

module.exports = mongoose.model('User', userSchema);

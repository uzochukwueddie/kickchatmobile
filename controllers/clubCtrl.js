const HttpStatus = require('http-status-codes');

const User = require('../models/User');
const Epl = require('../models/EPL');
const Laliga = require('../models/Laliga');
const Bundesliga = require('../models/Bundesliga');
const Ligue1 = require('../models/Ligue1');
const Seria = require('../models/SeriaA');

const EplChat = require('../models/EplChat');
const BundesligaChat = require('../models/BundesligaChat');
const SeriaAChat = require('../models/SeriaAChat');
const LaligaChat = require('../models/LaligaChat');
const Ligue1Chat = require('../models/Ligue1Chat');

module.exports = {
    async getEnglishClubs(req, res) {
        try {
            const rooms = await Epl.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async getSpanishClubs(req, res) {
        try {
            const rooms = await Laliga.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async getGermanClubs(req, res) {
        try {
            const rooms = await Bundesliga.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async getFrenchClubs(req, res) {
        try {
            const rooms = await Ligue1.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async getItalianClubs(req, res) {
        try {
            const rooms = await Seria.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async saveRoomMsg(req, res) {
        try {
            if(req.body.message && req.body.country === 'England'){
                const room = new EplChat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                await room.save();
            }
            if(req.body.message && req.body.country === 'Germany'){
                const room = new BundesligaChat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                await room.save();
            }
            if(req.body.message && req.body.country === 'Spain'){
                const room = new LaligaChat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                await room.save();
            }
            if(req.body.message && req.body.country === 'Italy'){
                const room = new SeriaAChat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                await room.save();
            }
            if(req.body.message && req.body.country === 'France'){
                const room = new Ligue1Chat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                await room.save();
            }
            return res.status(200).json({message: 'Message saved successfully'})
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async addToFavorites(req, res) {
        try {
            if (req.body.country === 'England') {
                await Epl.updateOne({
                    '_id': req.body.roomId,
                    'fans.userId': {$ne: req.user._id}
                }, {
                    $push: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                    'favClub': {$ne: req.body.room}
                }, {
                    $push: {favClub: req.body.room}
                });
                const room = await Epl.findOne({_id: req.body.roomId});
                return res.status(HttpStatus.OK).json({message: `${req.body.room} has been added to favorite`, room});
            }
            if (req.body.country === 'Spain') {
                await Laliga.updateOne({
                    '_id': req.body.roomId,
                    'fans.userId': {$ne: req.user._id}
                }, {
                    $push: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                    'favClub': {$ne: req.body.room}
                }, {
                    $push: {favClub: req.body.room}
                });
                const room = await Laliga.findOne({_id: req.body.roomId});
                return res.status(HttpStatus.OK).json({message: `${req.body.room} has been added to favorite`, room});
            }
            if (req.body.country === 'France') {
                await Ligue1.updateOne({
                    '_id': req.body.roomId,
                    'fans.userId': {$ne: req.user._id}
                }, {
                    $push: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                    'favClub': {$ne: req.body.room}
                }, {
                    $push: {favClub: req.body.room}
                });
                const room = await Ligue1.findOne({_id: req.body.roomId});
                return res.status(HttpStatus.OK).json({message: `${req.body.room} has been added to favorite`, room});
            }
            if (req.body.country === 'Germany') {
                await Bundesliga.updateOne({
                    '_id': req.body.roomId,
                    'fans.userId': {$ne: req.user._id}
                }, {
                    $push: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                    'favClub': {$ne: req.body.room}
                }, {
                    $push: {favClub: req.body.room}
                });
                const room = await Bundesliga.findOne({_id: req.body.roomId});
                return res.status(HttpStatus.OK).json({message: `${req.body.room} has been added to favorite`, room});
            }
            if (req.body.country === 'Italy') {
                await Seria.updateOne({
                    '_id': req.body.roomId,
                    'fans.userId': {$ne: req.user._id}
                }, {
                    $push: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                    'favClub': {$ne: req.body.room}
                }, {
                    $push: {favClub: req.body.room}
                });
                const room = await Seria.findOne({_id: req.body.roomId});
                return res.status(HttpStatus.OK).json({message: `${req.body.room} has been added to favorite`, room});
            }
            
        } catch (err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },
}
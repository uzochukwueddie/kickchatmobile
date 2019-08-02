const HttpStatus = require('http-status-codes');

const Club = require('../models/Club');
const User = require('../models/User');

module.exports = {
    async getAllRooms(req, res) {
        try {
            const rooms = await Club.find({})
                                .populate('fans.userId')
                                .sort({'name': 1});
            res.status(HttpStatus.OK).json({ message: 'All rooms', rooms });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async addToFavorite(req, res) {
        try {
            await Club.updateOne({
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
            
            return res.status(200).json({message: `${req.body.room} has been added to favorite`});
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async getRoom(req, res) {
        try {
            const room = req.params.name.replace(/-/g, ' ')
            const club = await Club.findOne({'name': room}).populate('fans.userId');
            return res.status(200).json({message: 'Single Room', room: club});
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
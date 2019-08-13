const HttpStatus = require('http-status-codes');

const GroupChat = require('../models/Group');

const EplChat = require('../models/EplChat');
const BundesligaChat = require('../models/BundesligaChat');
const SeriaAChat = require('../models/SeriaAChat');
const LaligaChat = require('../models/LaligaChat');
const Ligue1Chat = require('../models/Ligue1Chat');

module.exports = {
    async getClubMessages(req, res) {
        try {
            if (req.params.country === 'England') {
                const roomMsg = await EplChat.find({'room': req.params.club.replace(/-/g, ' ')}).populate('sender');
                return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
            }
            if (req.params.country === 'Spain') {
                const roomMsg = await LaligaChat.find({'room': req.params.club.replace(/-/g, ' ')}).populate('sender');
                return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
            }
            if (req.params.country === 'Germany') {
                const roomMsg = await BundesligaChat.find({'room': req.params.club.replace(/-/g, ' ')}).populate('sender');
                return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
            }
            if (req.params.country === 'Italy') {
                const roomMsg = await SeriaAChat.find({'room': req.params.club.replace(/-/g, ' ')}).populate('sender');
                return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
            }
            if (req.params.country === 'France') {
                const roomMsg = await Ligue1Chat.find({'room': req.params.club.replace(/-/g, ' ')})
                                        .populate('sender');
                return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
            }
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
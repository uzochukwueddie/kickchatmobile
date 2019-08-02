const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const Club = require('../models/Club');
const User = require('../models/User');

module.exports = {
    async addProfile(req, res) {        
        try {
            const user = await User.updateOne({
                _id: req.user._id
            }, {
                username: req.body.username,
                country: req.body.country,
                mantra: req.body.mantra,
                club: req.body.club,
                gender: req.body.gender,
                city: req.body.city
            });

            const userData = {
                _id: req.user._id,
                username: req.body.username
            }
            const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
            let type = null;
            
            if (user.facebook || user.google) {
                type = 'social';
            }

            return res.status(HttpStatus.OK).json({message: 'Profile Updated', token, type});
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async addInterest(req, res) {
        try {
            if(req.body.clubs){
                await User.updateOne({
                    _id: req.user._id,
                    'favClub': {$ne: req.body.clubs}
                }, {
                    $addToSet: { "favClub": { $each: req.body.clubs } },
                }); 
            }

            if(req.body.players){
                await User.updateOne({
                    _id: req.user._id,
                    'favPlayers': {$ne: req.body.players}
                }, {
                    $addToSet: { "favPlayers": { $each: req.body.players } }
                });    
            }

            if (req.body.national) {
                await User.updateOne({
                    _id: req.user._id,
                    'favTeams': {$ne: req.body.national}
                }, {
                    $addToSet: { "favTeams": { $each: req.body.national } }
                });
            }
            
            return res.status(HttpStatus.OK).json({message: 'Profile Updated'}) 
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async deleteInterest(req, res) {    
        try {
            if(req.body.interest === 'favClub'){
                await User.updateOne({
                    _id: req.user._id,
                }, {
                    $pull: { "favClub": req.body.item },
                }); 

                await Club.updateOne({
                    "name": req.body.item
                }, {
                    $pull: { "fans": {
                        username: req.user.username 
                    }},
                });
                
                return res.status(HttpStatus.OK).json({message: `${req.body.item} has been deleted`});
            }

            if(req.body.interest === 'favPlayer'){
                await User.updateOne({
                    _id: req.user._id,
                }, {
                    $pull: { "favPlayers": req.body.item },
                }); 
                
                return res.status(HttpStatus.OK).json({message: `${req.body.item} has been deleted`});
            }

            if(req.body.interest === 'favTeam'){
                await User.updateOne({
                    _id: req.user._id,
                }, {
                    $pull: { "favTeams": req.body.item },
                }); 
                
                return res.status(HttpStatus.OK).json({message: `${req.body.item} has been deleted`});
            }
            
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
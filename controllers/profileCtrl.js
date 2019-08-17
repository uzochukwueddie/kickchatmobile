const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Club = require('../models/Club');
const User = require('../models/User');
const Epl = require('../models/EPL');
const Laliga = require('../models/Laliga');
const Bundesliga = require('../models/Bundesliga');
const Ligue1 = require('../models/Ligue1');
const Seria = require('../models/SeriaA');
const Helpers = require('../helpers/helpers');

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
                const clubs = req.body.clubs;
                _.forEach(clubs, async (value) => {
                    const resp = value.split('-');
                    const room = {
                        club: resp[0],
                        country: resp[1]
                    };

                    await User.updateOne({
                        _id: req.user._id,
                        'favClub.club': {$ne: room.club}
                    }, {
                        $push: {favClub: {
                            club: room.club,
                            country: room.country
                        }}
                    }); 
                    Helpers.updateRoomsArray(req, room.club, room.country)
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
            // if(req.body.interest === 'favClub'){
            //     await User.updateOne({
            //         _id: req.user._id,
            //     }, {
            //         $pull: { "favClub": req.body.item },
            //     }); 

            //     await Club.updateOne({
            //         "name": req.body.item
            //     }, {
            //         $pull: { "fans": {
            //             username: req.user.username 
            //         }},
            //     });
                
            //     return res.status(HttpStatus.OK).json({message: `${req.body.item} has been deleted`});
            // }

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
    },

    async deleteFavClub(req, res) {    
        try {
            if (req.body.country === 'England') {
                await Epl.updateOne({
                    'name': req.body.club,
                }, {
                    $pull: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                }, {
                    $pull: {favClub: {
                        club: req.body.club,
                    }}
                });
                return res.status(HttpStatus.OK).json({message: `${req.body.club} has been deleted`});
            }
            if (req.body.country === 'Spain') {
                await Laliga.updateOne({
                    'name': req.body.club,
                }, {
                    $pull: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                }, {
                    $pull: {favClub: {
                        club: req.body.club,
                    }}
                });
                return res.status(HttpStatus.OK).json({message: `${req.body.club} has been deleted`});
            }
            if (req.body.country === 'France') {
                await Ligue1.updateOne({
                    'name': req.body.club,
                }, {
                    $pull: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                }, {
                    $pull: {favClub: {
                        club: req.body.club,
                    }}
                });
                return res.status(HttpStatus.OK).json({message: `${req.body.club} has been deleted`});
            }
            if (req.body.country === 'Germany') {
                await Bundesliga.updateOne({
                    'name': req.body.club,
                }, {
                    $pull: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                }, {
                    $pull: {favClub: {
                        club: req.body.club,
                    }}
                });
                return res.status(HttpStatus.OK).json({message: `${req.body.club} has been deleted`});
            }
            if (req.body.country === 'Italy') {
                await Seria.updateOne({
                    'name': req.body.club,
                }, {
                    $pull: {fans: {
                        userId: req.user._id
                    }}
                });
                
                await User.updateOne({
                    '_id': req.user._id,
                }, {
                    $pull: {favClub: {
                        club: req.body.club,
                    }}
                });
                return res.status(HttpStatus.OK).json({message: `${req.body.club} has been deleted`});
            }
            
        } catch (err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
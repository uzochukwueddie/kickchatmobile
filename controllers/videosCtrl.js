const HttpStatus = require('http-status-codes');

const Videos = require('../models/Videos');

module.exports = {
    async getVideosUrl(req, res) {
        const regex = new RegExp((req.body.searchTerm), 'gi');

        const result = await Videos.find({$or: [{team1: {$regex: regex}}, {team2: {$regex: regex}}]});
        if (result.length > 0) {
            res.status(HttpStatus.OK).json({message: 'Results found', result});
        } else {
            res.status(HttpStatus.OK).json({message: 'Results found', result: []});
        }
    },

    async getVideos(req, res) {
        const result = await Videos.find({});
        if (result.length > 0) {
            res.status(HttpStatus.OK).json({message: 'Results found', result});
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Results found', result: []});
        }
    }
}
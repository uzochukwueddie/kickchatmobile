const express = require("express");

const router = express.Router();

const axios = require('axios');
const _ = require('lodash');

const Club = require('../models/Club');
const Epl = require('../models/EPL');
const Ligue = require('../models/Ligue1');
const Bundesliga = require('../models/Bundesliga');
const Laliga = require('../models/Laliga');
const Seria = require('../models/SeriaA');
const Country = require('../models/Countries');
const Videos = require('../models/Videos');
const Helpers = require('../helpers/helpers');



router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// router.post('/dashboard', (req, res) => {
//     const newClub = new Club();
//     newClub.name = req.body.club;
//     newClub.country = req.body.country;
//     newClub.image = req.body.upload;
//     newClub.save((err) => {
//         res.render('dashboard');
//     });
// });

router.post('/dashboard', (req, res) => {
    if (req.body.country === 'England') {
        const newClub = new Epl();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Spain') {
        const newClub = new Laliga();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'France') {
        const newClub = new Ligue();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Germany') {
        const newClub = new Bundesliga();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Italy') {
        const newClub = new Seria();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
});

router.get('/dashboard/add-country', (req, res) => {
    res.render('add-country');
});

router.post('/dashboard/add-country', (req, res) => {
    const country = new Country();
    country.name = req.body.country;
    country.image = req.body.image;
    country.save((err) => {
        res.render('add-country');
    });
});

router.get('/dashboard/videos', async (req, res) => {
    const resp = await axios.get('https://www.scorebat.com/video-api/v1/');
    const lists = Helpers.getVideosUrl(resp.data);
    _.forEach(lists, async (val) => {
        const checkVideo = await Videos.findOne({video: val.link});
        if (!checkVideo) {
            const video = new Videos();
            video.team1 = val.team1;
            video.team2 = val.team2;
            video.video = val.link;

            video.save();
        }
    });
    const videosLink = await Videos.find({});
    res.render('videos', {videos: videosLink});
});

module.exports = router;